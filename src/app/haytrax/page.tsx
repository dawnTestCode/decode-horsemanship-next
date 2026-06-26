'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { ChevronLeft, Package, Minus, Plus, Check, X, Circle } from 'lucide-react';

type View = 'main' | 'bought' | 'used';
type BaleType = 'round' | 'square';
type HayType = 'fescue' | 'fescue-free' | 'alfalfa';

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
  'Front Field',
  'Back Field',
  'Side Pasture',
  'Barn Lot',
  'Quarantine',
];

const SQUARE_BALE_USES = [
  'Horse stalls',
  'Goats',
  'Chickens',
  'Bedding',
  'Other',
];

const HAY_TYPES: { value: HayType; label: string }[] = [
  { value: 'fescue', label: 'Fescue' },
  { value: 'fescue-free', label: 'Fescue-Free' },
  { value: 'alfalfa', label: 'Alfalfa' },
];

export default function HayTraxPage() {
  const [view, setView] = useState<View>('main');
  const [inventory, setInventory] = useState<Inventory>({
    round: 0,
    square: { fescue: 0, 'fescue-free': 0, alfalfa: 0, total: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // For buying hay
  const [buyBaleType, setBuyBaleType] = useState<BaleType | null>(null);
  const [buyHayType, setBuyHayType] = useState<HayType | null>(null);
  const [buyQuantity, setBuyQuantity] = useState(1);

  // For using hay
  const [useBaleType, setUseBaleType] = useState<BaleType | null>(null);
  const [useHayType, setUseHayType] = useState<HayType | null>(null);
  const [useLocation, setUseLocation] = useState('');

  const fetchInventory = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('hay_inventory')
        .select('bale_type, hay_type, quantity');

      if (error) throw error;

      const inv: Inventory = {
        round: 0,
        square: { fescue: 0, 'fescue-free': 0, alfalfa: 0, total: 0 },
      };

      data?.forEach((row: { bale_type: string; hay_type: string | null; quantity: number }) => {
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
    } catch (err) {
      console.error('Error fetching inventory:', err);
      setError('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const resetState = () => {
    setBuyBaleType(null);
    setBuyHayType(null);
    setBuyQuantity(1);
    setUseBaleType(null);
    setUseHayType(null);
    setUseLocation('');
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
      });

      if (error) throw error;

      const typeLabel = buyBaleType === 'square' && buyHayType
        ? `${HAY_TYPES.find(t => t.value === buyHayType)?.label} `
        : '';
      setSuccess(`Added ${buyQuantity} ${typeLabel}${buyBaleType} bale${buyQuantity > 1 ? 's' : ''}`);
      await fetchInventory();
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
      });

      if (error) throw error;

      const typeLabel = useBaleType === 'square' && useHayType
        ? `${HAY_TYPES.find(t => t.value === useHayType)?.label} `
        : '';
      setSuccess(`Used 1 ${typeLabel}${useBaleType} bale for ${useLocation}`);
      await fetchInventory();
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
      </main>
    </div>
  );
}
