'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { ChevronLeft, Package, Minus, Plus, Check, X } from 'lucide-react';

type View = 'main' | 'bought' | 'used';
type BaleType = 'round' | 'square';

interface Inventory {
  round: number;
  square: number;
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

export default function HayTraxPage() {
  const [view, setView] = useState<View>('main');
  const [inventory, setInventory] = useState<Inventory>({ round: 0, square: 0 });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // For buying hay
  const [buyBaleType, setBuyBaleType] = useState<BaleType | null>(null);
  const [buyQuantity, setBuyQuantity] = useState(1);

  // For using hay
  const [useBaleType, setUseBaleType] = useState<BaleType | null>(null);
  const [useLocation, setUseLocation] = useState('');

  const fetchInventory = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('hay_inventory')
        .select('bale_type, quantity');

      if (error) throw error;

      const inv: Inventory = { round: 0, square: 0 };
      data?.forEach((row: { bale_type: string; quantity: number }) => {
        if (row.bale_type === 'round' || row.bale_type === 'square') {
          inv[row.bale_type] = row.quantity;
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
    setBuyQuantity(1);
    setUseBaleType(null);
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

    setSubmitting(true);
    setError(null);

    try {
      const { error } = await supabase.rpc('record_hay_purchase', {
        p_bale_type: buyBaleType,
        p_quantity: buyQuantity,
      });

      if (error) throw error;

      setSuccess(`Added ${buyQuantity} ${buyBaleType} bale${buyQuantity > 1 ? 's' : ''}`);
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

    setSubmitting(true);
    setError(null);

    try {
      const { error } = await supabase.rpc('record_hay_usage', {
        p_bale_type: useBaleType,
        p_quantity: 1,
        p_usage_location: useLocation,
      });

      if (error) throw error;

      setSuccess(`Used 1 ${useBaleType} bale for ${useLocation}`);
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
        <div className="flex justify-center gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold">{inventory.round}</div>
            <div className="text-amber-200 text-sm">Round Bales</div>
          </div>
          <div className="w-px bg-amber-700" />
          <div className="text-center">
            <div className="text-4xl font-bold">{inventory.square}</div>
            <div className="text-amber-200 text-sm">Square Bales</div>
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
                onClick={() => setBuyBaleType('round')}
                className={`p-6 rounded-xl border-2 transition-all ${
                  buyBaleType === 'round'
                    ? 'border-amber-700 bg-amber-100'
                    : 'border-amber-200 bg-white hover:border-amber-400'
                }`}
              >
                <Package size={32} className="mx-auto mb-2 text-amber-700" />
                <div className="font-semibold text-amber-900">Round</div>
              </button>
              <button
                onClick={() => setBuyBaleType('square')}
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

            {/* Quantity input */}
            {buyBaleType && (
              <div className="space-y-3">
                <label className="block text-amber-900 font-medium">
                  How many {buyBaleType} bales?
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
            {buyBaleType && (
              <button
                onClick={handleBuyHay}
                disabled={submitting}
                className="w-full py-4 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white text-lg font-semibold rounded-xl shadow-lg transition-colors"
              >
                {submitting ? 'Saving...' : `Add ${buyQuantity} ${buyBaleType} bale${buyQuantity > 1 ? 's' : ''}`}
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
                <Package size={32} className={`mx-auto mb-2 ${inventory.round === 0 ? 'text-gray-400' : 'text-amber-700'}`} />
                <div className={`font-semibold ${inventory.round === 0 ? 'text-gray-500' : 'text-amber-900'}`}>Round</div>
                <div className={`text-sm ${inventory.round === 0 ? 'text-gray-400' : 'text-amber-600'}`}>
                  {inventory.round} left
                </div>
              </button>
              <button
                onClick={() => {
                  setUseBaleType('square');
                  setUseLocation('');
                }}
                disabled={inventory.square === 0}
                className={`p-6 rounded-xl border-2 transition-all ${
                  useBaleType === 'square'
                    ? 'border-amber-700 bg-amber-100'
                    : inventory.square === 0
                    ? 'border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed'
                    : 'border-amber-200 bg-white hover:border-amber-400'
                }`}
              >
                <Package size={32} className={`mx-auto mb-2 ${inventory.square === 0 ? 'text-gray-400' : 'text-amber-700'}`} />
                <div className={`font-semibold ${inventory.square === 0 ? 'text-gray-500' : 'text-amber-900'}`}>Square</div>
                <div className={`text-sm ${inventory.square === 0 ? 'text-gray-400' : 'text-amber-600'}`}>
                  {inventory.square} left
                </div>
              </button>
            </div>

            {/* Location/use selection */}
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

            {useBaleType === 'square' && (
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
            {useBaleType && useLocation && (
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
