'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { ChevronLeft, Package, Minus, Plus, Check, X, Circle, Calendar, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

type View = 'main' | 'bought' | 'used' | 'stats';
type BaleType = 'round' | 'square';
type HayType = 'fescue' | 'fescue-free' | 'alfalfa';

interface Transaction {
  id: string;
  bale_type: BaleType;
  hay_type: HayType | null;
  transaction_type: 'bought' | 'used';
  quantity: number;
  usage_location: string | null;
  created_at: string;
}

interface Inventory {
  round: number;
  square: {
    fescue: number;
    'fescue-free': number;
    alfalfa: number;
    total: number;
  };
}

const ROUND_BALE_FIELDS = [
  'Field 1',
  'Field 2',
  'Field 3',
  'Field 4',
  'Field 5',
  'Field 6',
  'Field 7',
  'Field 8',
  'Field 9',
  'Field 10',
  'Barn',
];

const SQUARE_BALE_USES = [
  'Horse stalls',
  'Pregnant mare(s)',
  'Field 2',
  'Field 3',
  'Field 4',
  'Field 5',
  'Field 6',
  'Field 7',
  'Field 8',
  'Field 9',
  'Field 10',
];

const HAY_TYPES: { value: HayType; label: string }[] = [
  { value: 'fescue', label: 'Fescue' },
  { value: 'fescue-free', label: 'Fescue-Free' },
  { value: 'alfalfa', label: 'Alfalfa' },
];

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}

function getHayTypeLabel(hayType: HayType | null): string {
  if (!hayType) return '';
  const type = HAY_TYPES.find(t => t.value === hayType);
  return type ? type.label : hayType;
}

function getLastSevenDays(): { date: Date; label: string; value: string }[] {
  const days = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    date.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues

    let label: string;
    if (i === 0) {
      label = 'Today';
    } else if (i === 1) {
      label = 'Yesterday';
    } else {
      label = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }

    days.push({
      date,
      label,
      value: date.toISOString(),
    });
  }

  return days;
}

export default function HayTraxPage() {
  const [view, setView] = useState<View>('main');
  const [inventory, setInventory] = useState<Inventory>({
    round: 0,
    square: { fescue: 0, 'fescue-free': 0, alfalfa: 0, total: 0 },
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]); // 3 months for stats
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // For buying hay
  const [buyBaleType, setBuyBaleType] = useState<BaleType | null>(null);
  const [buyHayType, setBuyHayType] = useState<HayType | null>(null);
  const [buyQuantity, setBuyQuantity] = useState(1);
  const [buyDate, setBuyDate] = useState<string | null>(null); // null = today
  const [showBuyDatePicker, setShowBuyDatePicker] = useState(false);

  // For using hay
  const [useBaleType, setUseBaleType] = useState<BaleType | null>(null);
  const [useHayType, setUseHayType] = useState<HayType | null>(null);
  const [useLocation, setUseLocation] = useState('');
  const [useDate, setUseDate] = useState<string | null>(null); // null = today
  const [showUseDatePicker, setShowUseDatePicker] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      // Fetch inventory
      const { data: invData, error: invError } = await supabase
        .from('hay_inventory')
        .select('bale_type, hay_type, quantity');

      if (invError) throw invError;

      const inv: Inventory = {
        round: 0,
        square: { fescue: 0, 'fescue-free': 0, alfalfa: 0, total: 0 },
      };

      invData?.forEach((row: { bale_type: string; hay_type: string | null; quantity: number }) => {
        if (row.bale_type === 'round') {
          inv.round = row.quantity;
        } else if (row.bale_type === 'square' && row.hay_type) {
          const hayType = row.hay_type as HayType;
          if (hayType in inv.square) {
            inv.square[hayType] = row.quantity;
            inv.square.total += row.quantity;
          }
        }
      });

      setInventory(inv);

      // Fetch recent transactions (last 30 days for activity list)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: txData, error: txError } = await supabase
        .from('hay_transactions')
        .select('id, bale_type, hay_type, transaction_type, quantity, usage_location, created_at')
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false });

      if (txError) throw txError;

      setTransactions(txData as Transaction[] || []);

      // Fetch 3 months of transactions for stats
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

      const { data: allTxData, error: allTxError } = await supabase
        .from('hay_transactions')
        .select('id, bale_type, hay_type, transaction_type, quantity, usage_location, created_at')
        .gte('created_at', threeMonthsAgo.toISOString())
        .order('created_at', { ascending: true });

      if (allTxError) throw allTxError;

      setAllTransactions(allTxData as Transaction[] || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const resetState = () => {
    setBuyBaleType(null);
    setBuyHayType(null);
    setBuyQuantity(1);
    setBuyDate(null);
    setShowBuyDatePicker(false);
    setUseBaleType(null);
    setUseHayType(null);
    setUseLocation('');
    setUseDate(null);
    setShowUseDatePicker(false);
    setError(null);
    setSuccess(null);
  };

  const handleBack = () => {
    resetState();
    setView('main');
  };

  const handleBuyHay = async () => {
    if (!buyBaleType || buyQuantity < 1) return;
    if (buyBaleType === 'square' && !buyHayType) return;

    setSubmitting(true);
    setError(null);

    try {
      const { error } = await supabase.rpc('record_hay_purchase', {
        p_bale_type: buyBaleType,
        p_quantity: buyQuantity,
        p_hay_type: buyBaleType === 'square' ? buyHayType : null,
        p_transaction_date: buyDate,
      });

      if (error) throw error;

      const typeLabel = buyBaleType === 'square' && buyHayType
        ? `${HAY_TYPES.find(t => t.value === buyHayType)?.label} `
        : '';
      setSuccess(`Added ${buyQuantity} ${typeLabel}${buyBaleType} bale${buyQuantity > 1 ? 's' : ''}`);
      await fetchData();
      setTimeout(() => {
        handleBack();
      }, 1500);
    } catch (err) {
      console.error('Error recording purchase:', err);
      setError('Failed to record purchase');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUseHay = async () => {
    if (!useBaleType || !useLocation) return;
    if (useBaleType === 'square' && !useHayType) return;

    setSubmitting(true);
    setError(null);

    try {
      const { error } = await supabase.rpc('record_hay_usage', {
        p_bale_type: useBaleType,
        p_quantity: 1,
        p_usage_location: useLocation,
        p_hay_type: useBaleType === 'square' ? useHayType : null,
        p_transaction_date: useDate,
      });

      if (error) throw error;

      const typeLabel = useBaleType === 'square' && useHayType
        ? `${HAY_TYPES.find(t => t.value === useHayType)?.label} `
        : '';
      setSuccess(`Used 1 ${typeLabel}${useBaleType} bale for ${useLocation}`);
      await fetchData();
      setTimeout(() => {
        handleBack();
      }, 1500);
    } catch (err) {
      console.error('Error recording usage:', err);
      if (err instanceof Error && err.message.includes('Insufficient')) {
        setError('Not enough bales in inventory');
      } else {
        setError('Failed to record usage');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Compute stats from 3 months of data
  const stats = useMemo(() => {
    const now = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(now.getMonth() - 3);

    // Filter to only usage transactions
    const usageTransactions = allTransactions.filter(tx => tx.transaction_type === 'used');

    // Count usage by bale type
    const roundUsed = usageTransactions
      .filter(tx => tx.bale_type === 'round')
      .reduce((sum, tx) => sum + tx.quantity, 0);

    const squareUsed = usageTransactions
      .filter(tx => tx.bale_type === 'square')
      .reduce((sum, tx) => sum + tx.quantity, 0);

    // Calculate days in the period
    const oldestTx = allTransactions[0];
    const daysInPeriod = oldestTx
      ? Math.max(1, Math.ceil((now.getTime() - new Date(oldestTx.created_at).getTime()) / (1000 * 60 * 60 * 24)))
      : 90;

    // Daily usage rates
    const roundPerDay = roundUsed / daysInPeriod;
    const squarePerDay = squareUsed / daysInPeriod;

    // Days until empty (runway)
    const roundRunway = roundPerDay > 0 ? Math.floor(inventory.round / roundPerDay) : Infinity;
    const squareRunway = squarePerDay > 0 ? Math.floor(inventory.square.total / squarePerDay) : Infinity;

    // Weekly data for chart (group by week)
    const weeklyData: { week: string; round: number; square: number }[] = [];
    const weekMap = new Map<string, { round: number; square: number }>();

    usageTransactions.forEach(tx => {
      const date = new Date(tx.created_at);
      // Get start of week (Sunday)
      const startOfWeek = new Date(date);
      startOfWeek.setDate(date.getDate() - date.getDay());
      const weekKey = startOfWeek.toISOString().split('T')[0];

      if (!weekMap.has(weekKey)) {
        weekMap.set(weekKey, { round: 0, square: 0 });
      }

      const week = weekMap.get(weekKey)!;
      if (tx.bale_type === 'round') {
        week.round += tx.quantity;
      } else {
        week.square += tx.quantity;
      }
    });

    // Convert to array and sort
    Array.from(weekMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([weekKey, data]) => {
        const date = new Date(weekKey);
        const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        weeklyData.push({ week: label, ...data });
      });

    // Calculate field consumption rates (days per bale for each field)
    // Group round bale usage by field, sorted by date
    const roundBalesByField = new Map<string, Date[]>();
    usageTransactions
      .filter(tx => tx.bale_type === 'round' && tx.usage_location)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      .forEach(tx => {
        const field = tx.usage_location!;
        if (!roundBalesByField.has(field)) {
          roundBalesByField.set(field, []);
        }
        roundBalesByField.get(field)!.push(new Date(tx.created_at));
      });

    // Calculate average days between bales for each field
    const fieldConsumption: { field: string; avgDays: number; baleCount: number; lastBale: Date }[] = [];

    roundBalesByField.forEach((dates, field) => {
      if (dates.length >= 2) {
        // Calculate intervals between consecutive bales
        const intervals: number[] = [];
        for (let i = 1; i < dates.length; i++) {
          const daysBetween = Math.round(
            (dates[i].getTime() - dates[i - 1].getTime()) / (1000 * 60 * 60 * 24)
          );
          intervals.push(daysBetween);
        }
        const avgDays = intervals.reduce((sum, d) => sum + d, 0) / intervals.length;
        fieldConsumption.push({
          field,
          avgDays: Math.round(avgDays * 10) / 10,
          baleCount: dates.length,
          lastBale: dates[dates.length - 1],
        });
      } else if (dates.length === 1) {
        // Only one bale recorded - show as "gathering data"
        fieldConsumption.push({
          field,
          avgDays: -1, // indicates insufficient data
          baleCount: 1,
          lastBale: dates[0],
        });
      }
    });

    // Sort by average days (fastest consumers first), then by field name
    fieldConsumption.sort((a, b) => {
      if (a.avgDays === -1 && b.avgDays === -1) return a.field.localeCompare(b.field);
      if (a.avgDays === -1) return 1;
      if (b.avgDays === -1) return -1;
      return a.avgDays - b.avgDays;
    });

    return {
      roundUsed,
      squareUsed,
      roundPerDay,
      squarePerDay,
      roundRunway,
      squareRunway,
      weeklyData,
      daysInPeriod,
      fieldConsumption,
    };
  }, [allTransactions, inventory]);

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-amber-900 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header with inventory */}
      <header className="bg-amber-900 text-amber-50 px-4 pb-6 pt-6" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 1.5rem)' }}>
        <h1 className="text-2xl font-bold text-center mb-4">HayTrax</h1>
        <div className="flex justify-center gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold">{inventory.round}</div>
            <div className="text-amber-200 text-sm">Round</div>
          </div>
          <div className="w-px bg-amber-700" />
          <div className="text-center">
            <div className="text-4xl font-bold">{inventory.square.total}</div>
            <div className="text-amber-200 text-sm">Square</div>
            <div className="text-amber-300 text-xs mt-1">
              {inventory.square.fescue}F / {inventory.square['fescue-free']}FF / {inventory.square.alfalfa}A
            </div>
          </div>
        </div>
      </header>

      <main className="p-4 max-w-md mx-auto">
        {/* Success/Error messages */}
        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-300 rounded-lg flex items-center gap-3 text-green-800">
            <Check size={20} />
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-300 rounded-lg flex items-center gap-3 text-red-800">
            <X size={20} />
            {error}
          </div>
        )}

        {/* Main view */}
        {view === 'main' && (
          <div className="space-y-4 mt-8">
            <button
              onClick={() => setView('used')}
              className="w-full py-6 px-6 bg-amber-700 hover:bg-amber-800 text-white text-xl font-semibold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-3"
            >
              <Minus size={24} />
              Gave Hay
            </button>
            <button
              onClick={() => setView('bought')}
              className="w-full py-6 px-6 bg-amber-600 hover:bg-amber-700 text-white text-xl font-semibold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-3"
            >
              <Plus size={24} />
              Bought Hay
            </button>

            <button
              onClick={() => setView('stats')}
              className="w-full py-4 px-6 bg-white hover:bg-amber-50 text-amber-700 border-2 border-amber-300 text-lg font-semibold rounded-xl shadow transition-colors flex items-center justify-center gap-3"
            >
              <BarChart3 size={20} />
              View Stats
            </button>

            {/* Recent Activity */}
            {transactions.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-amber-900 mb-3">Recent Activity</h2>
                <div className="space-y-2">
                  {transactions.map((tx) => {
                    const isBought = tx.transaction_type === 'bought';
                    const hayTypeLabel = tx.bale_type === 'square' && tx.hay_type
                      ? ` ${getHayTypeLabel(tx.hay_type)}`
                      : '';

                    return (
                      <div
                        key={tx.id}
                        className="bg-white rounded-lg border border-amber-200 p-3 flex items-center gap-3"
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isBought ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {isBought ? <Plus size={16} /> : <Minus size={16} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-amber-900">
                            {isBought ? (
                              <>
                                <span className="font-medium">+{tx.quantity}</span>
                                {hayTypeLabel} {tx.bale_type}
                              </>
                            ) : (
                              <>
                                <span className="font-medium">-{tx.quantity}</span>
                                {hayTypeLabel} {tx.bale_type}
                                {tx.usage_location && (
                                  <span className="text-amber-600"> → {tx.usage_location}</span>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                        <div className="text-xs text-amber-500 whitespace-nowrap">
                          {formatDate(tx.created_at)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bought hay view */}
        {view === 'bought' && (
          <div className="space-y-6">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-amber-700 hover:text-amber-900 transition-colors"
            >
              <ChevronLeft size={20} />
              Back
            </button>

            <h2 className="text-xl font-semibold text-amber-900">What did you buy?</h2>

            {/* Bale type selection */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => {
                  setBuyBaleType('round');
                  setBuyHayType(null);
                }}
                className={`p-6 rounded-xl border-2 transition-all ${
                  buyBaleType === 'round'
                    ? 'border-amber-700 bg-amber-100'
                    : 'border-amber-200 bg-white hover:border-amber-400'
                }`}
              >
                <Circle size={32} className="mx-auto mb-2 text-amber-700" />
                <div className="font-semibold text-amber-900">Round</div>
              </button>
              <button
                onClick={() => {
                  setBuyBaleType('square');
                  setBuyHayType(null);
                }}
                className={`p-6 rounded-xl border-2 transition-all ${
                  buyBaleType === 'square'
                    ? 'border-amber-700 bg-amber-100'
                    : 'border-amber-200 bg-white hover:border-amber-400'
                }`}
              >
                <Package size={32} className="mx-auto mb-2 text-amber-700" />
                <div className="font-semibold text-amber-900">Square</div>
              </button>
            </div>

            {/* Hay type selection for square bales */}
            {buyBaleType === 'square' && (
              <div className="space-y-3">
                <label className="block text-amber-900 font-medium">What type of hay?</label>
                <div className="space-y-2">
                  {HAY_TYPES.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setBuyHayType(type.value)}
                      className={`w-full py-3 px-4 rounded-lg border-2 text-left transition-all ${
                        buyHayType === type.value
                          ? 'border-amber-700 bg-amber-100 text-amber-900'
                          : 'border-amber-200 bg-white text-amber-800 hover:border-amber-400'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity input */}
            {buyBaleType && (buyBaleType === 'round' || buyHayType) && (
              <div className="space-y-3">
                <label className="block text-amber-900 font-medium">
                  How many bales?
                </label>
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => setBuyQuantity(Math.max(1, buyQuantity - 1))}
                    className="w-14 h-14 rounded-full bg-amber-200 hover:bg-amber-300 text-amber-900 flex items-center justify-center transition-colors"
                  >
                    <Minus size={24} />
                  </button>
                  <input
                    type="number"
                    value={buyQuantity}
                    onChange={(e) => setBuyQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 text-center text-3xl font-bold text-amber-900 bg-white border-2 border-amber-200 rounded-lg py-2"
                    min="1"
                  />
                  <button
                    onClick={() => setBuyQuantity(buyQuantity + 1)}
                    className="w-14 h-14 rounded-full bg-amber-200 hover:bg-amber-300 text-amber-900 flex items-center justify-center transition-colors"
                  >
                    <Plus size={24} />
                  </button>
                </div>
              </div>
            )}

            {/* Date picker */}
            {buyBaleType && (buyBaleType === 'round' || buyHayType) && (
              <div className="space-y-2">
                <button
                  onClick={() => setShowBuyDatePicker(!showBuyDatePicker)}
                  className="flex items-center gap-2 text-sm text-amber-700 hover:text-amber-900 transition-colors"
                >
                  <Calendar size={16} />
                  <span>
                    {buyDate
                      ? getLastSevenDays().find(d => d.value === buyDate)?.label || 'Selected date'
                      : 'Today'}
                  </span>
                  <span className="text-amber-500">(tap to change)</span>
                </button>

                {showBuyDatePicker && (
                  <div className="flex flex-wrap gap-2">
                    {getLastSevenDays().map((day) => (
                      <button
                        key={day.value}
                        onClick={() => {
                          setBuyDate(day.label === 'Today' ? null : day.value);
                          setShowBuyDatePicker(false);
                        }}
                        className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${
                          (buyDate === day.value || (buyDate === null && day.label === 'Today'))
                            ? 'border-amber-700 bg-amber-100 text-amber-900'
                            : 'border-amber-200 bg-white text-amber-700 hover:border-amber-400'
                        }`}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Submit button */}
            {buyBaleType && (buyBaleType === 'round' || buyHayType) && (
              <button
                onClick={handleBuyHay}
                disabled={submitting}
                className="w-full py-4 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white text-lg font-semibold rounded-xl shadow-lg transition-colors"
              >
                {submitting ? 'Saving...' : `Add ${buyQuantity} bale${buyQuantity > 1 ? 's' : ''}`}
              </button>
            )}
          </div>
        )}

        {/* Used hay view */}
        {view === 'used' && (
          <div className="space-y-6">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-amber-700 hover:text-amber-900 transition-colors"
            >
              <ChevronLeft size={20} />
              Back
            </button>

            <h2 className="text-xl font-semibold text-amber-900">What type of bale?</h2>

            {/* Bale type selection */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => {
                  setUseBaleType('round');
                  setUseHayType(null);
                  setUseLocation('');
                }}
                disabled={inventory.round === 0}
                className={`p-6 rounded-xl border-2 transition-all ${
                  useBaleType === 'round'
                    ? 'border-amber-700 bg-amber-100'
                    : inventory.round === 0
                    ? 'border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed'
                    : 'border-amber-200 bg-white hover:border-amber-400'
                }`}
              >
                <Circle size={32} className={`mx-auto mb-2 ${inventory.round === 0 ? 'text-gray-400' : 'text-amber-700'}`} />
                <div className={`font-semibold ${inventory.round === 0 ? 'text-gray-500' : 'text-amber-900'}`}>Round</div>
                <div className={`text-sm ${inventory.round === 0 ? 'text-gray-400' : 'text-amber-600'}`}>
                  {inventory.round} left
                </div>
              </button>
              <button
                onClick={() => {
                  setUseBaleType('square');
                  setUseHayType(null);
                  setUseLocation('');
                }}
                disabled={inventory.square.total === 0}
                className={`p-6 rounded-xl border-2 transition-all ${
                  useBaleType === 'square'
                    ? 'border-amber-700 bg-amber-100'
                    : inventory.square.total === 0
                    ? 'border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed'
                    : 'border-amber-200 bg-white hover:border-amber-400'
                }`}
              >
                <Package size={32} className={`mx-auto mb-2 ${inventory.square.total === 0 ? 'text-gray-400' : 'text-amber-700'}`} />
                <div className={`font-semibold ${inventory.square.total === 0 ? 'text-gray-500' : 'text-amber-900'}`}>Square</div>
                <div className={`text-sm ${inventory.square.total === 0 ? 'text-gray-400' : 'text-amber-600'}`}>
                  {inventory.square.total} left
                </div>
              </button>
            </div>

            {/* Hay type selection for square bales */}
            {useBaleType === 'square' && (
              <div className="space-y-3">
                <label className="block text-amber-900 font-medium">What type of hay?</label>
                <div className="space-y-2">
                  {HAY_TYPES.map((type) => {
                    const count = inventory.square[type.value];
                    const disabled = count === 0;
                    return (
                      <button
                        key={type.value}
                        onClick={() => {
                          setUseHayType(type.value);
                          setUseLocation('');
                        }}
                        disabled={disabled}
                        className={`w-full py-3 px-4 rounded-lg border-2 text-left transition-all flex justify-between items-center ${
                          useHayType === type.value
                            ? 'border-amber-700 bg-amber-100 text-amber-900'
                            : disabled
                            ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'border-amber-200 bg-white text-amber-800 hover:border-amber-400'
                        }`}
                      >
                        <span>{type.label}</span>
                        <span className={`text-sm ${disabled ? 'text-gray-400' : 'text-amber-600'}`}>
                          {count} left
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Location/use selection for round bales */}
            {useBaleType === 'round' && (
              <div className="space-y-3">
                <label className="block text-amber-900 font-medium">Which field?</label>
                <div className="space-y-2">
                  {ROUND_BALE_FIELDS.map((field) => (
                    <button
                      key={field}
                      onClick={() => setUseLocation(field)}
                      className={`w-full py-3 px-4 rounded-lg border-2 text-left transition-all ${
                        useLocation === field
                          ? 'border-amber-700 bg-amber-100 text-amber-900'
                          : 'border-amber-200 bg-white text-amber-800 hover:border-amber-400'
                      }`}
                    >
                      {field}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Usage selection for square bales (after hay type is selected) */}
            {useBaleType === 'square' && useHayType && (
              <div className="space-y-3">
                <label className="block text-amber-900 font-medium">What was it used for?</label>
                <div className="space-y-2">
                  {SQUARE_BALE_USES.map((use) => (
                    <button
                      key={use}
                      onClick={() => setUseLocation(use)}
                      className={`w-full py-3 px-4 rounded-lg border-2 text-left transition-all ${
                        useLocation === use
                          ? 'border-amber-700 bg-amber-100 text-amber-900'
                          : 'border-amber-200 bg-white text-amber-800 hover:border-amber-400'
                      }`}
                    >
                      {use}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Date picker */}
            {useBaleType && useLocation && (useBaleType === 'round' || useHayType) && (
              <div className="space-y-2">
                <button
                  onClick={() => setShowUseDatePicker(!showUseDatePicker)}
                  className="flex items-center gap-2 text-sm text-amber-700 hover:text-amber-900 transition-colors"
                >
                  <Calendar size={16} />
                  <span>
                    {useDate
                      ? getLastSevenDays().find(d => d.value === useDate)?.label || 'Selected date'
                      : 'Today'}
                  </span>
                  <span className="text-amber-500">(tap to change)</span>
                </button>

                {showUseDatePicker && (
                  <div className="flex flex-wrap gap-2">
                    {getLastSevenDays().map((day) => (
                      <button
                        key={day.value}
                        onClick={() => {
                          setUseDate(day.label === 'Today' ? null : day.value);
                          setShowUseDatePicker(false);
                        }}
                        className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${
                          (useDate === day.value || (useDate === null && day.label === 'Today'))
                            ? 'border-amber-700 bg-amber-100 text-amber-900'
                            : 'border-amber-200 bg-white text-amber-700 hover:border-amber-400'
                        }`}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Submit button */}
            {useBaleType && useLocation && (useBaleType === 'round' || useHayType) && (
              <button
                onClick={handleUseHay}
                disabled={submitting}
                className="w-full py-4 bg-amber-700 hover:bg-amber-800 disabled:bg-amber-400 text-white text-lg font-semibold rounded-xl shadow-lg transition-colors"
              >
                {submitting ? 'Saving...' : `Use 1 ${useBaleType} bale`}
              </button>
            )}
          </div>
        )}

        {/* Stats view */}
        {view === 'stats' && (
          <div className="space-y-6">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-amber-700 hover:text-amber-900 transition-colors"
            >
              <ChevronLeft size={20} />
              Back
            </button>

            <h2 className="text-xl font-semibold text-amber-900">Usage Stats</h2>

            {/* 3-month totals */}
            <div className="bg-white rounded-xl border border-amber-200 p-4">
              <h3 className="text-sm font-medium text-amber-600 mb-3">
                Last {stats.daysInPeriod} days
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-3xl font-bold text-amber-900">{stats.roundUsed}</div>
                  <div className="text-sm text-amber-600">Round bales used</div>
                  <div className="text-xs text-amber-500 mt-1">
                    ~{stats.roundPerDay.toFixed(1)}/day
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-amber-900">{stats.squareUsed}</div>
                  <div className="text-sm text-amber-600">Square bales used</div>
                  <div className="text-xs text-amber-500 mt-1">
                    ~{stats.squarePerDay.toFixed(1)}/day
                  </div>
                </div>
              </div>
            </div>

            {/* Runway projections */}
            <div className="bg-white rounded-xl border border-amber-200 p-4">
              <h3 className="text-sm font-medium text-amber-600 mb-3">
                Runway (at current usage)
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className={`text-2xl font-bold ${
                    stats.roundRunway <= 7 ? 'text-red-600' :
                    stats.roundRunway <= 14 ? 'text-amber-600' :
                    'text-green-600'
                  }`}>
                    {stats.roundRunway === Infinity ? '—' :
                      stats.roundRunway <= 1 ? '<1 day' :
                      stats.roundRunway < 7 ? `${stats.roundRunway} days` :
                      `${Math.floor(stats.roundRunway / 7)} weeks`}
                  </div>
                  <div className="text-sm text-amber-600">Round bales</div>
                  <div className="text-xs text-amber-500 mt-1">
                    {inventory.round} in stock
                  </div>
                </div>
                <div>
                  <div className={`text-2xl font-bold ${
                    stats.squareRunway <= 7 ? 'text-red-600' :
                    stats.squareRunway <= 14 ? 'text-amber-600' :
                    'text-green-600'
                  }`}>
                    {stats.squareRunway === Infinity ? '—' :
                      stats.squareRunway <= 1 ? '<1 day' :
                      stats.squareRunway < 7 ? `${stats.squareRunway} days` :
                      `${Math.floor(stats.squareRunway / 7)} weeks`}
                  </div>
                  <div className="text-sm text-amber-600">Square bales</div>
                  <div className="text-xs text-amber-500 mt-1">
                    {inventory.square.total} in stock
                  </div>
                </div>
              </div>
            </div>

            {/* Field consumption rates */}
            {stats.fieldConsumption.length > 0 && (
              <div className="bg-white rounded-xl border border-amber-200 p-4">
                <h3 className="text-sm font-medium text-amber-600 mb-3">
                  Field Consumption (Days per Round Bale)
                </h3>
                <div className="space-y-2">
                  {stats.fieldConsumption.map(({ field, avgDays, baleCount, lastBale }) => {
                    const daysSinceLastBale = Math.floor(
                      (Date.now() - lastBale.getTime()) / (1000 * 60 * 60 * 24)
                    );

                    return (
                      <div
                        key={field}
                        className="flex items-center justify-between py-2 border-b border-amber-100 last:border-0"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-amber-900">{field}</div>
                          <div className="text-xs text-amber-500">
                            {baleCount} bale{baleCount !== 1 ? 's' : ''} tracked
                            {daysSinceLastBale > 0 && ` · last ${daysSinceLastBale}d ago`}
                          </div>
                        </div>
                        <div className="text-right">
                          {avgDays === -1 ? (
                            <div className="text-sm text-amber-400 italic">gathering data</div>
                          ) : (
                            <>
                              <div className={`text-xl font-bold ${
                                avgDays <= 7 ? 'text-red-600' :
                                avgDays <= 14 ? 'text-amber-600' :
                                'text-green-600'
                              }`}>
                                {avgDays} days
                              </div>
                              <div className="text-xs text-amber-500">avg per bale</div>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {stats.fieldConsumption.length === 0 && (
              <div className="bg-white rounded-xl border border-amber-200 p-6 text-center text-amber-600">
                No field consumption data yet.
                <br />
                <span className="text-sm text-amber-500">Record round bale usage to track field consumption rates.</span>
              </div>
            )}

            {/* Weekly usage chart */}
            {stats.weeklyData.length >= 2 && (
              <div className="bg-white rounded-xl border border-amber-200 p-4">
                <h3 className="text-sm font-medium text-amber-600 mb-3">
                  Weekly Usage Trend
                </h3>
                <div style={{ width: '100%', height: 192 }}>
                  <ResponsiveContainer>
                    <BarChart data={stats.weeklyData} margin={{ top: 10, right: 10, bottom: 5, left: 0 }}>
                      <XAxis
                        dataKey="week"
                        tick={{ fontSize: 10, fill: '#92400e' }}
                        tickLine={false}
                        axisLine={{ stroke: '#fbbf24' }}
                      />
                      <YAxis
                        tick={{ fontSize: 10, fill: '#92400e' }}
                        tickLine={false}
                        axisLine={{ stroke: '#fbbf24' }}
                        allowDecimals={false}
                        width={30}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fffbeb',
                          border: '1px solid #fbbf24',
                          borderRadius: '8px',
                          fontSize: '12px',
                        }}
                      />
                      <Bar dataKey="round" fill="#b45309" name="Round" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="square" fill="#d97706" name="Square" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6 mt-2">
                  <div className="flex items-center gap-2 text-xs text-amber-700">
                    <div className="w-3 h-3 rounded-full bg-amber-700" />
                    Round
                  </div>
                  <div className="flex items-center gap-2 text-xs text-amber-600">
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    Square
                  </div>
                </div>
              </div>
            )}

            {stats.weeklyData.length < 2 && (
              <div className="bg-white rounded-xl border border-amber-200 p-6 text-center text-amber-600">
                Not enough data yet for usage trends.
                <br />
                <span className="text-sm text-amber-500">Check back after recording more activity.</span>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
