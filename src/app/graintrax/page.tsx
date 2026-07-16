'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { ChevronLeft, Plus, Check, X, Calendar, BarChart3, Users, Pencil, Trash2, Settings, Minus } from 'lucide-react';

type View = 'main' | 'bought' | 'horses' | 'stats' | 'addHorse' | 'editHorse' | 'settings' | 'missedFeeding' | 'activity';
type GrainType = 'strategy' | 'omelene' | 'enrich';
type ItemType = 'grain' | 'vitamin';

interface Horse {
  id: string;
  name: string;
  grain_type: GrainType;
  cans_per_feeding: number;
  vitamin_scoops: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

type TransactionType = 'bought' | 'horse_added' | 'horse_updated' | 'horse_removed' | 'half_feeding';

interface Transaction {
  id: string;
  item_type: ItemType;
  grain_type: GrainType | null;
  transaction_type: TransactionType;
  quantity: number;
  horse_id: string | null;
  horse_name: string | null;
  details: string | null;
  created_at: string;
}

interface Inventory {
  grain: {
    strategy: number;
    omelene: number;
    enrich: number;
  };
  vitamin: number;
}

interface GrainSettings {
  lbs_per_can_strategy: number;
  lbs_per_can_omelene: number;
  lbs_per_can_enrich: number;
  lbs_per_scoop_vitamin: number;
  bag_size_grain: number;
  bag_size_vitamin: number;
}

const DEFAULT_SETTINGS: GrainSettings = {
  lbs_per_can_strategy: 1.8,
  lbs_per_can_omelene: 1.2,
  lbs_per_can_enrich: 1.5,
  lbs_per_scoop_vitamin: 0.1,
  bag_size_grain: 50,
  bag_size_vitamin: 5,
};

const GRAIN_TYPES: { value: GrainType; label: string; shortLabel: string }[] = [
  { value: 'strategy', label: 'Strategy Professional Gx', shortLabel: 'Strategy' },
  { value: 'omelene', label: 'Omelene 300 Mare & Foal', shortLabel: 'Omelene' },
  { value: 'enrich', label: 'Enrich +', shortLabel: 'Enrich' },
];

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();

  if (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  ) {
    return 'Today';
  }

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getGrainTypeLabel(grainType: GrainType | null, short = false): string {
  if (!grainType) return '';
  const type = GRAIN_TYPES.find(t => t.value === grainType);
  return type ? (short ? type.shortLabel : type.label) : grainType;
}

function getLastSevenDays(): { date: Date; label: string; value: string }[] {
  const days = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    date.setHours(12, 0, 0, 0);

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

export default function GrainTraxPage() {
  const [view, setView] = useState<View>('main');
  const [horses, setHorses] = useState<Horse[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [settings, setSettings] = useState<GrainSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // For buying grain/vitamins
  const [buyItemType, setBuyItemType] = useState<ItemType | null>(null);
  const [buyGrainType, setBuyGrainType] = useState<GrainType | null>(null);
  const [buyQuantity, setBuyQuantity] = useState(1);
  const [buyDate, setBuyDate] = useState<string | null>(null);
  const [showBuyDatePicker, setShowBuyDatePicker] = useState(false);

  // For adding/editing horses
  const [editingHorse, setEditingHorse] = useState<Horse | null>(null);
  const [horseName, setHorseName] = useState('');
  const [horseGrainType, setHorseGrainType] = useState<GrainType>('strategy');
  const [horseCansPerFeeding, setHorseCansPerFeeding] = useState('1');
  const [horseVitaminScoops, setHorseVitaminScoops] = useState('0');

  // For editing settings
  const [editSettings, setEditSettings] = useState<GrainSettings>(DEFAULT_SETTINGS);

  // For missed feeding selection
  const [selectedHorseIds, setSelectedHorseIds] = useState<Set<string>>(new Set());

  const fetchData = useCallback(async () => {
    try {
      // Fetch horses
      const { data: horseData, error: horseError } = await supabase
        .from('grain_horses')
        .select('*')
        .order('name', { ascending: true });

      if (horseError) throw horseError;

      setHorses(horseData as Horse[] || []);

      // Fetch ALL transactions (for calculating inventory from purchases)
      const { data: txData, error: txError } = await supabase
        .from('grain_transactions')
        .select('id, item_type, grain_type, transaction_type, quantity, horse_id, horse_name, details, created_at')
        .order('created_at', { ascending: false });

      if (txError) throw txError;

      setTransactions(txData as Transaction[] || []);

      // Fetch settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('grain_settings')
        .select('setting_key, setting_value');

      if (settingsError) throw settingsError;

      if (settingsData) {
        const loadedSettings: GrainSettings = { ...DEFAULT_SETTINGS };
        settingsData.forEach((row: { setting_key: string; setting_value: number }) => {
          const key = row.setting_key as keyof GrainSettings;
          if (key in loadedSettings) {
            loadedSettings[key] = Number(row.setting_value);
          }
        });
        setSettings(loadedSettings);
        setEditSettings(loadedSettings);
      }
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
    setBuyItemType(null);
    setBuyGrainType(null);
    setBuyQuantity(1);
    setBuyDate(null);
    setShowBuyDatePicker(false);
    setEditingHorse(null);
    setHorseName('');
    setHorseGrainType('strategy');
    setHorseCansPerFeeding('1');
    setHorseVitaminScoops('0');
    setSelectedHorseIds(new Set());
    setError(null);
    setSuccess(null);
  };

  const handleBack = () => {
    resetState();
    setView('main');
  };

  const handleBackToHorses = () => {
    setEditingHorse(null);
    setHorseName('');
    setHorseGrainType('strategy');
    setHorseCansPerFeeding('1');
    setHorseVitaminScoops('0');
    setError(null);
    setSuccess(null);
    setView('horses');
  };

  const handleBuyGrain = async () => {
    if (!buyItemType || buyQuantity < 1) return;
    if (buyItemType === 'grain' && !buyGrainType) return;

    setSubmitting(true);
    setError(null);

    try {
      const { error } = await supabase.rpc('record_grain_purchase', {
        p_item_type: buyItemType,
        p_quantity: buyQuantity,
        p_grain_type: buyItemType === 'grain' ? buyGrainType : null,
        p_transaction_date: buyDate,
      });

      if (error) throw error;

      const typeLabel = buyItemType === 'grain' && buyGrainType
        ? getGrainTypeLabel(buyGrainType, true)
        : 'Vitamin';
      setSuccess(`Added ${buyQuantity} bag${buyQuantity > 1 ? 's' : ''} of ${typeLabel}`);
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

  const handleAddHorse = async () => {
    if (!horseName.trim()) {
      setError('Please enter a horse name');
      return;
    }

    const cans = parseFloat(horseCansPerFeeding);
    const vitamins = parseFloat(horseVitaminScoops);

    if (isNaN(cans) || cans < 0) {
      setError('Please enter a valid number of cans');
      return;
    }

    if (isNaN(vitamins) || vitamins < 0) {
      setError('Please enter a valid number of vitamin scoops');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const { data: horseId, error } = await supabase.rpc('add_grain_horse', {
        p_name: horseName.trim(),
        p_grain_type: horseGrainType,
        p_cans_per_feeding: cans,
        p_vitamin_scoops: vitamins,
      });

      if (error) throw error;

      // Record activity
      await supabase.rpc('record_horse_activity', {
        p_horse_id: horseId,
        p_horse_name: horseName.trim(),
        p_activity_type: 'horse_added',
        p_details: `${cans} cans ${getGrainTypeLabel(horseGrainType, true)}/feeding`,
      });

      setSuccess(`Added ${horseName.trim()}`);
      await fetchData();
      setTimeout(() => {
        handleBackToHorses();
      }, 1500);
    } catch (err) {
      console.error('Error adding horse:', err);
      setError('Failed to add horse');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateHorse = async () => {
    if (!editingHorse) return;
    if (!horseName.trim()) {
      setError('Please enter a horse name');
      return;
    }

    const cans = parseFloat(horseCansPerFeeding);
    const vitamins = parseFloat(horseVitaminScoops);

    if (isNaN(cans) || cans < 0) {
      setError('Please enter a valid number of cans');
      return;
    }

    if (isNaN(vitamins) || vitamins < 0) {
      setError('Please enter a valid number of vitamin scoops');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const { error } = await supabase.rpc('update_grain_horse', {
        p_id: editingHorse.id,
        p_name: horseName.trim(),
        p_grain_type: horseGrainType,
        p_cans_per_feeding: cans,
        p_vitamin_scoops: vitamins,
      });

      if (error) throw error;

      // Record activity with what changed
      const changes: string[] = [];
      if (editingHorse.cans_per_feeding !== cans) {
        changes.push(`${editingHorse.cans_per_feeding} → ${cans} cans`);
      }
      if (editingHorse.grain_type !== horseGrainType) {
        changes.push(`${getGrainTypeLabel(editingHorse.grain_type, true)} → ${getGrainTypeLabel(horseGrainType, true)}`);
      }
      if (editingHorse.vitamin_scoops !== vitamins) {
        changes.push(`vitamins ${editingHorse.vitamin_scoops} → ${vitamins}`);
      }

      await supabase.rpc('record_horse_activity', {
        p_horse_id: editingHorse.id,
        p_horse_name: horseName.trim(),
        p_activity_type: 'horse_updated',
        p_details: changes.length > 0 ? changes.join(', ') : 'no changes',
      });

      setSuccess(`Updated ${horseName.trim()}`);
      await fetchData();
      setTimeout(() => {
        handleBackToHorses();
      }, 1500);
    } catch (err) {
      console.error('Error updating horse:', err);
      setError('Failed to update horse');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivateHorse = async (horse: Horse) => {
    if (!confirm(`Are you sure you want to remove ${horse.name}? This will keep historical data but remove them from active calculations.`)) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const { error } = await supabase.rpc('deactivate_grain_horse', {
        p_id: horse.id,
      });

      if (error) throw error;

      // Record activity
      await supabase.rpc('record_horse_activity', {
        p_horse_id: horse.id,
        p_horse_name: horse.name,
        p_activity_type: 'horse_removed',
      });

      setSuccess(`Removed ${horse.name}`);
      await fetchData();
    } catch (err) {
      console.error('Error deactivating horse:', err);
      setError('Failed to remove horse');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReactivateHorse = async (horse: Horse) => {
    setSubmitting(true);
    setError(null);

    try {
      const { error } = await supabase.rpc('update_grain_horse', {
        p_id: horse.id,
        p_active: true,
      });

      if (error) throw error;

      // Record activity
      await supabase.rpc('record_horse_activity', {
        p_horse_id: horse.id,
        p_horse_name: horse.name,
        p_activity_type: 'horse_added',
        p_details: 'reactivated',
      });

      setSuccess(`Reactivated ${horse.name}`);
      await fetchData();
    } catch (err) {
      console.error('Error reactivating horse:', err);
      setError('Failed to reactivate horse');
    } finally {
      setSubmitting(false);
    }
  };

  const startEditHorse = (horse: Horse) => {
    setEditingHorse(horse);
    setHorseName(horse.name);
    setHorseGrainType(horse.grain_type);
    setHorseCansPerFeeding(horse.cans_per_feeding.toString());
    setHorseVitaminScoops(horse.vitamin_scoops.toString());
    setView('editHorse');
  };

  const openSettings = () => {
    setEditSettings({ ...settings });
    setView('settings');
  };

  const handleSaveSettings = async () => {
    setSubmitting(true);
    setError(null);

    try {
      // Update each setting
      const updates = Object.entries(editSettings).map(([key, value]) =>
        supabase.rpc('update_grain_setting', {
          p_setting_key: key,
          p_setting_value: value,
        })
      );

      const results = await Promise.all(updates);
      const errors = results.filter(r => r.error);
      if (errors.length > 0) throw errors[0].error;

      setSettings({ ...editSettings });
      setSuccess('Settings saved');
      setTimeout(() => {
        handleBack();
      }, 1500);
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Failed to save settings');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMissedFeeding = async (horseIds: string[] | 'all') => {
    setSubmitting(true);
    setError(null);

    try {
      if (horseIds === 'all') {
        const { error } = await supabase.rpc('record_half_feeding');
        if (error) throw error;
        setSuccess('Marked missed feeding for all horses');
      } else {
        // Record missed feeding for selected horses (one transaction per horse)
        for (const horseId of horseIds) {
          const { error } = await supabase.rpc('record_half_feeding_for_horse', {
            p_horse_id: horseId,
          });
          if (error) throw error;
        }
        const horseNames = horses
          .filter(h => horseIds.includes(h.id))
          .map(h => h.name)
          .join(', ');
        setSuccess(`Marked missed feeding for ${horseNames}`);
      }
      await fetchData();
      setTimeout(() => {
        handleBack();
      }, 1500);
    } catch (err) {
      console.error('Error recording missed feeding:', err);
      setError('Failed to record missed feeding');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleHorseSelection = (horseId: string) => {
    setSelectedHorseIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(horseId)) {
        newSet.delete(horseId);
      } else {
        newSet.add(horseId);
      }
      return newSet;
    });
  };

  // Helper to get lbs per can for a grain type from settings
  const getLbsPerCan = useCallback((grainType: GrainType): number => {
    switch (grainType) {
      case 'strategy': return settings.lbs_per_can_strategy;
      case 'omelene': return settings.lbs_per_can_omelene;
      case 'enrich': return settings.lbs_per_can_enrich;
    }
  }, [settings]);

  // Calculate daily usage, inventory, and runway stats
  const stats = useMemo(() => {
    const activeHorses = horses.filter(h => h.active);

    // Calculate daily grain usage in lbs for each grain type
    const dailyGrainLbs: Record<GrainType, number> = {
      strategy: 0,
      omelene: 0,
      enrich: 0,
    };

    // Calculate daily vitamin scoops and lbs (vitamin_scoops is per feeding, 2 feedings/day)
    let dailyVitaminScoops = 0;

    activeHorses.forEach(horse => {
      // 2 feedings per day
      const dailyCans = horse.cans_per_feeding * 2;
      const dailyLbs = dailyCans * getLbsPerCan(horse.grain_type);
      dailyGrainLbs[horse.grain_type] += dailyLbs;
      dailyVitaminScoops += horse.vitamin_scoops * 2; // 2 feedings per day
    });

    // Daily vitamin lbs
    const dailyVitaminLbs = dailyVitaminScoops * settings.lbs_per_scoop_vitamin;

    // Calculate bags per day
    const bagsPerDay: Record<GrainType, number> = {
      strategy: dailyGrainLbs.strategy / settings.bag_size_grain,
      omelene: dailyGrainLbs.omelene / settings.bag_size_grain,
      enrich: dailyGrainLbs.enrich / settings.bag_size_grain,
    };

    const vitaminBagsPerDay = dailyVitaminLbs / settings.bag_size_vitamin;

    // === CALCULATE INVENTORY FROM TRANSACTIONS ===

    // Sum all purchases
    const purchasedBags: Record<GrainType, number> = {
      strategy: 0,
      omelene: 0,
      enrich: 0,
    };
    let purchasedVitaminBags = 0;
    let earliestPurchaseDate: Date | null = null;

    transactions
      .filter(tx => tx.transaction_type === 'bought')
      .forEach(tx => {
        const txDate = new Date(tx.created_at);
        if (!earliestPurchaseDate || txDate < earliestPurchaseDate) {
          earliestPurchaseDate = txDate;
        }
        if (tx.item_type === 'grain' && tx.grain_type) {
          purchasedBags[tx.grain_type as GrainType] += tx.quantity;
        } else if (tx.item_type === 'vitamin') {
          purchasedVitaminBags += tx.quantity;
        }
      });

    // Calculate days since first purchase
    const now = new Date();
    const daysSinceFirstPurchase = earliestPurchaseDate !== null
      ? Math.max(0, (now.getTime() - (earliestPurchaseDate as Date).getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    // Calculate grain saved from missed feedings (in bags)
    let savedGrainBags: Record<GrainType, number> = {
      strategy: 0,
      omelene: 0,
      enrich: 0,
    };
    let savedVitaminBags = 0;

    transactions
      .filter(tx => tx.transaction_type === 'half_feeding')
      .forEach(tx => {
        if (tx.details === 'Horses fed once') {
          // All horses missed a feeding - add one feeding worth for each horse
          activeHorses.forEach(horse => {
            const lbsSaved = horse.cans_per_feeding * getLbsPerCan(horse.grain_type);
            savedGrainBags[horse.grain_type] += lbsSaved / settings.bag_size_grain;
            savedVitaminBags += (horse.vitamin_scoops * settings.lbs_per_scoop_vitamin) / settings.bag_size_vitamin;
          });
        } else if (tx.details) {
          // Specific horse(s) missed a feeding - parse horse name from details
          const horseName = tx.details.replace(' missed feeding', '');
          const horse = horses.find(h => h.name === horseName);
          if (horse) {
            const lbsSaved = horse.cans_per_feeding * getLbsPerCan(horse.grain_type);
            savedGrainBags[horse.grain_type] += lbsSaved / settings.bag_size_grain;
            savedVitaminBags += (horse.vitamin_scoops * settings.lbs_per_scoop_vitamin) / settings.bag_size_vitamin;
          }
        }
      });

    // Calculate consumed bags since first purchase
    const consumedBags: Record<GrainType, number> = {
      strategy: bagsPerDay.strategy * daysSinceFirstPurchase,
      omelene: bagsPerDay.omelene * daysSinceFirstPurchase,
      enrich: bagsPerDay.enrich * daysSinceFirstPurchase,
    };
    const consumedVitaminBags = vitaminBagsPerDay * daysSinceFirstPurchase;

    // Current inventory = purchased - consumed + saved from missed feedings
    const calculatedInventory = {
      grain: {
        strategy: Math.max(0, purchasedBags.strategy - consumedBags.strategy + savedGrainBags.strategy),
        omelene: Math.max(0, purchasedBags.omelene - consumedBags.omelene + savedGrainBags.omelene),
        enrich: Math.max(0, purchasedBags.enrich - consumedBags.enrich + savedGrainBags.enrich),
      },
      vitamin: Math.max(0, purchasedVitaminBags - consumedVitaminBags + savedVitaminBags),
    };

    // Calculate runway in days using calculated inventory
    const runwayDays: Record<GrainType, number> = {
      strategy: bagsPerDay.strategy > 0 ? Math.floor(calculatedInventory.grain.strategy / bagsPerDay.strategy) : Infinity,
      omelene: bagsPerDay.omelene > 0 ? Math.floor(calculatedInventory.grain.omelene / bagsPerDay.omelene) : Infinity,
      enrich: bagsPerDay.enrich > 0 ? Math.floor(calculatedInventory.grain.enrich / bagsPerDay.enrich) : Infinity,
    };

    const vitaminRunwayDays = vitaminBagsPerDay > 0 ? Math.floor(calculatedInventory.vitamin / vitaminBagsPerDay) : Infinity;

    // Calculate weekly and monthly grain usage in bags
    const weeklyBags: Record<GrainType, number> = {
      strategy: bagsPerDay.strategy * 7,
      omelene: bagsPerDay.omelene * 7,
      enrich: bagsPerDay.enrich * 7,
    };

    const monthlyBags: Record<GrainType, number> = {
      strategy: bagsPerDay.strategy * 30,
      omelene: bagsPerDay.omelene * 30,
      enrich: bagsPerDay.enrich * 30,
    };

    // Per-horse daily consumption in lbs
    const horseConsumption = activeHorses.map(horse => ({
      horse,
      dailyLbs: horse.cans_per_feeding * 2 * getLbsPerCan(horse.grain_type),
      dailyCans: horse.cans_per_feeding * 2,
    })).sort((a, b) => b.dailyLbs - a.dailyLbs);

    return {
      activeHorses,
      dailyGrainLbs,
      dailyVitaminScoops,
      dailyVitaminLbs,
      bagsPerDay,
      vitaminBagsPerDay,
      runwayDays,
      vitaminRunwayDays,
      weeklyBags,
      monthlyBags,
      horseConsumption,
      calculatedInventory,
    };
  }, [horses, transactions, settings, getLbsPerCan]);

  if (loading) {
    return (
      <div className="min-h-screen bg-emerald-50 flex items-center justify-center">
        <div className="text-emerald-900 text-lg">Loading...</div>
      </div>
    );
  }

  // Use calculated inventory from stats
  const inventory = stats.calculatedInventory;
  const totalGrainBags = Math.round((inventory.grain.strategy + inventory.grain.omelene + inventory.grain.enrich) * 10) / 10;

  return (
    <div className="min-h-screen bg-emerald-50">
      {/* Header with inventory */}
      <header className="bg-emerald-900 text-emerald-50 px-4 pb-6 pt-6" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 1.5rem)' }}>
        <h1 className="text-2xl font-bold text-center mb-4">GrainTrax</h1>
        <div className="flex justify-center gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold">{totalGrainBags.toFixed(1)}</div>
            <div className="text-emerald-200 text-sm">Grain Bags</div>
            <div className="text-emerald-300 text-xs mt-1">
              {inventory.grain.strategy.toFixed(1)}S / {inventory.grain.omelene.toFixed(1)}O / {inventory.grain.enrich.toFixed(1)}E
            </div>
          </div>
          <div className="w-px bg-emerald-700" />
          <div className="text-center">
            <div className="text-4xl font-bold">{inventory.vitamin.toFixed(1)}</div>
            <div className="text-emerald-200 text-sm">Vitamin Bag{inventory.vitamin !== 1 ? 's' : ''}</div>
          </div>
          <div className="w-px bg-emerald-700" />
          <div className="text-center">
            <div className="text-4xl font-bold">{stats.activeHorses.length}</div>
            <div className="text-emerald-200 text-sm">Horses</div>
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
              onClick={() => setView('bought')}
              className="w-full py-6 px-6 bg-emerald-700 hover:bg-emerald-800 text-white text-xl font-semibold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-3"
            >
              <Plus size={24} />
              Bought Grain
            </button>
            <button
              onClick={() => setView('horses')}
              className="w-full py-6 px-6 bg-emerald-600 hover:bg-emerald-700 text-white text-xl font-semibold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-3"
            >
              <Users size={24} />
              Manage Horses
            </button>

            <button
              onClick={() => setView('missedFeeding')}
              disabled={submitting}
              className="w-full py-3 px-6 bg-amber-100 hover:bg-amber-200 text-amber-800 border-2 border-amber-300 text-base font-medium rounded-xl shadow transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Minus size={18} />
              Missed Feeding
            </button>

            <div className="flex gap-4">
              <button
                onClick={() => setView('stats')}
                className="flex-1 py-4 px-6 bg-white hover:bg-emerald-50 text-emerald-700 border-2 border-emerald-300 text-lg font-semibold rounded-xl shadow transition-colors flex items-center justify-center gap-3"
              >
                <BarChart3 size={20} />
                View Stats
              </button>
              <button
                onClick={openSettings}
                className="py-4 px-4 bg-white hover:bg-emerald-50 text-emerald-700 border-2 border-emerald-300 rounded-xl shadow transition-colors flex items-center justify-center"
                title="Settings"
              >
                <Settings size={20} />
              </button>
            </div>

            {/* Recent activity */}
            {transactions.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-emerald-900">Recent Activity</h2>
                  <button
                    onClick={() => setView('activity')}
                    className="text-sm text-emerald-600 hover:text-emerald-800 transition-colors"
                  >
                    See All ({transactions.length})
                  </button>
                </div>
                <div className="space-y-2">
                  {transactions.slice(0, 8).map(tx => {
                    const isBought = tx.transaction_type === 'bought';
                    const isHorseAdded = tx.transaction_type === 'horse_added';
                    const isHorseUpdated = tx.transaction_type === 'horse_updated';
                    const isHorseRemoved = tx.transaction_type === 'horse_removed';
                    const isHalfFeeding = tx.transaction_type === 'half_feeding';

                    return (
                      <div
                        key={tx.id}
                        className="bg-white rounded-lg border border-emerald-200 p-3 flex items-center gap-3"
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isBought ? 'bg-green-100 text-green-700' :
                          isHorseAdded ? 'bg-blue-100 text-blue-700' :
                          isHorseUpdated ? 'bg-amber-100 text-amber-700' :
                          isHorseRemoved ? 'bg-red-100 text-red-700' :
                          isHalfFeeding ? 'bg-orange-100 text-orange-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {isBought && <Plus size={16} />}
                          {isHorseAdded && <Users size={16} />}
                          {isHorseUpdated && <Pencil size={16} />}
                          {isHorseRemoved && <Trash2 size={16} />}
                          {isHalfFeeding && <Minus size={16} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          {isBought && (
                            <div className="text-sm text-emerald-900">
                              <span className="font-medium">+{tx.quantity}</span>
                              {' '}
                              {tx.item_type === 'grain'
                                ? getGrainTypeLabel(tx.grain_type, true)
                                : 'Vitamin'
                              }
                              {' bag'}{tx.quantity > 1 ? 's' : ''}
                            </div>
                          )}
                          {isHorseAdded && (
                            <div className="text-sm text-emerald-900">
                              <span className="font-medium">Added {tx.horse_name}</span>
                              {tx.details && <span className="text-emerald-600"> ({tx.details})</span>}
                            </div>
                          )}
                          {isHorseUpdated && (
                            <div className="text-sm text-emerald-900">
                              <span className="font-medium">Updated {tx.horse_name}</span>
                              {tx.details && <span className="text-emerald-600"> ({tx.details})</span>}
                            </div>
                          )}
                          {isHorseRemoved && (
                            <div className="text-sm text-emerald-900">
                              <span className="font-medium">Removed {tx.horse_name}</span>
                            </div>
                          )}
                          {isHalfFeeding && (
                            <div className="text-sm text-emerald-900">
                              <span className="font-medium">Missed feeding</span>
                              {tx.details === 'Horses fed once' ? (
                                <span className="text-emerald-600"> (all horses)</span>
                              ) : tx.details && (
                                <span className="text-emerald-600"> ({tx.details.replace(' missed feeding', '')})</span>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-emerald-500 whitespace-nowrap">
                          {formatDate(tx.created_at)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Active horses list */}
            {stats.activeHorses.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-emerald-900 mb-3">Active Horses</h2>
                <div className="space-y-2">
                  {stats.activeHorses.map(horse => (
                    <div
                      key={horse.id}
                      className="bg-white rounded-lg border border-emerald-200 p-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-emerald-900">{horse.name}</div>
                          <div className="text-sm text-emerald-600">
                            {horse.cans_per_feeding} can{horse.cans_per_feeding !== 1 ? 's' : ''}/feeding of {getGrainTypeLabel(horse.grain_type, true)}
                          </div>
                          {horse.vitamin_scoops > 0 && (
                            <div className="text-xs text-emerald-500">
                              + {horse.vitamin_scoops} scoop{horse.vitamin_scoops !== 1 ? 's' : ''} vitamins/feeding
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-emerald-700">
                            {(horse.cans_per_feeding * 2 * getLbsPerCan(horse.grain_type)).toFixed(1)}
                          </div>
                          <div className="text-xs text-emerald-500">lbs/day</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bought grain view */}
        {view === 'bought' && (
          <div className="space-y-6">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-emerald-700 hover:text-emerald-900 transition-colors"
            >
              <ChevronLeft size={20} />
              Back
            </button>

            <h2 className="text-xl font-semibold text-emerald-900">What did you buy?</h2>

            {/* Item type selection */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => {
                  setBuyItemType('grain');
                  setBuyGrainType(null);
                }}
                className={`p-6 rounded-xl border-2 transition-all ${
                  buyItemType === 'grain'
                    ? 'border-emerald-700 bg-emerald-100'
                    : 'border-emerald-200 bg-white hover:border-emerald-400'
                }`}
              >
                <div className="text-3xl mb-2">&#127805;</div>
                <div className="font-semibold text-emerald-900">Grain</div>
              </button>
              <button
                onClick={() => {
                  setBuyItemType('vitamin');
                  setBuyGrainType(null);
                }}
                className={`p-6 rounded-xl border-2 transition-all ${
                  buyItemType === 'vitamin'
                    ? 'border-emerald-700 bg-emerald-100'
                    : 'border-emerald-200 bg-white hover:border-emerald-400'
                }`}
              >
                <div className="text-3xl mb-2">&#128138;</div>
                <div className="font-semibold text-emerald-900">Vitamins</div>
              </button>
            </div>

            {/* Grain type selection */}
            {buyItemType === 'grain' && (
              <div className="space-y-3">
                <label className="block text-emerald-900 font-medium">What type of grain?</label>
                <div className="space-y-2">
                  {GRAIN_TYPES.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setBuyGrainType(type.value)}
                      className={`w-full py-3 px-4 rounded-lg border-2 text-left transition-all ${
                        buyGrainType === type.value
                          ? 'border-emerald-700 bg-emerald-100 text-emerald-900'
                          : 'border-emerald-200 bg-white text-emerald-800 hover:border-emerald-400'
                      }`}
                    >
                      <div className="font-medium">{type.shortLabel}</div>
                      <div className="text-sm text-emerald-600">{type.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity input */}
            {buyItemType && (buyItemType === 'vitamin' || buyGrainType) && (
              <div className="space-y-3">
                <label className="block text-emerald-900 font-medium">
                  How many bags?
                </label>
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => setBuyQuantity(Math.max(1, buyQuantity - 1))}
                    className="w-14 h-14 rounded-full bg-emerald-200 hover:bg-emerald-300 text-emerald-900 flex items-center justify-center transition-colors text-2xl font-bold"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={buyQuantity}
                    onChange={(e) => setBuyQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 text-center text-3xl font-bold text-emerald-900 bg-white border-2 border-emerald-200 rounded-lg py-2"
                    min="1"
                  />
                  <button
                    onClick={() => setBuyQuantity(buyQuantity + 1)}
                    className="w-14 h-14 rounded-full bg-emerald-200 hover:bg-emerald-300 text-emerald-900 flex items-center justify-center transition-colors text-2xl font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Date picker */}
            {buyItemType && (buyItemType === 'vitamin' || buyGrainType) && (
              <div className="space-y-2">
                <button
                  onClick={() => setShowBuyDatePicker(!showBuyDatePicker)}
                  className="flex items-center gap-2 text-sm text-emerald-700 hover:text-emerald-900 transition-colors"
                >
                  <Calendar size={16} />
                  <span>
                    {buyDate
                      ? getLastSevenDays().find(d => d.value === buyDate)?.label || 'Selected date'
                      : 'Today'}
                  </span>
                  <span className="text-emerald-500">(tap to change)</span>
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
                            ? 'border-emerald-700 bg-emerald-100 text-emerald-900'
                            : 'border-emerald-200 bg-white text-emerald-700 hover:border-emerald-400'
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
            {buyItemType && (buyItemType === 'vitamin' || buyGrainType) && (
              <button
                onClick={handleBuyGrain}
                disabled={submitting}
                className="w-full py-4 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white text-lg font-semibold rounded-xl shadow-lg transition-colors"
              >
                {submitting ? 'Saving...' : `Add ${buyQuantity} bag${buyQuantity > 1 ? 's' : ''}`}
              </button>
            )}
          </div>
        )}

        {/* Horses list view */}
        {view === 'horses' && (
          <div className="space-y-6">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-emerald-700 hover:text-emerald-900 transition-colors"
            >
              <ChevronLeft size={20} />
              Back
            </button>

            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-emerald-900">Manage Horses</h2>
              <button
                onClick={() => setView('addHorse')}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                <Plus size={16} />
                Add Horse
              </button>
            </div>

            {/* Active horses */}
            {stats.activeHorses.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-emerald-600">Active ({stats.activeHorses.length})</h3>
                {stats.activeHorses.map(horse => (
                  <div
                    key={horse.id}
                    className="bg-white rounded-lg border border-emerald-200 p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-emerald-900 text-lg">{horse.name}</div>
                        <div className="text-sm text-emerald-600 mt-1">
                          {horse.cans_per_feeding} can{horse.cans_per_feeding !== 1 ? 's' : ''}/feeding of {getGrainTypeLabel(horse.grain_type, true)}
                        </div>
                        {horse.vitamin_scoops > 0 && (
                          <div className="text-sm text-emerald-500 mt-0.5">
                            + {horse.vitamin_scoops} scoop{horse.vitamin_scoops !== 1 ? 's' : ''} vitamins/feeding
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditHorse(horse)}
                          className="p-2 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-100 rounded-lg transition-colors"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDeactivateHorse(horse)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Inactive horses */}
            {horses.filter(h => !h.active).length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500">Inactive (sold)</h3>
                {horses.filter(h => !h.active).map(horse => (
                  <div
                    key={horse.id}
                    className="bg-gray-50 rounded-lg border border-gray-200 p-4 opacity-60"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-700">{horse.name}</div>
                        <div className="text-sm text-gray-500">
                          {getGrainTypeLabel(horse.grain_type, true)}
                        </div>
                      </div>
                      <button
                        onClick={() => handleReactivateHorse(horse)}
                        className="px-3 py-1 text-sm text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100 rounded-lg transition-colors"
                      >
                        Reactivate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {horses.length === 0 && (
              <div className="text-center py-8 text-emerald-600">
                No horses added yet.
                <br />
                <span className="text-sm text-emerald-500">Tap &quot;Add Horse&quot; to get started.</span>
              </div>
            )}
          </div>
        )}

        {/* Add horse view */}
        {view === 'addHorse' && (
          <div className="space-y-6">
            <button
              onClick={handleBackToHorses}
              className="flex items-center gap-2 text-emerald-700 hover:text-emerald-900 transition-colors"
            >
              <ChevronLeft size={20} />
              Back
            </button>

            <h2 className="text-xl font-semibold text-emerald-900">Add Horse</h2>

            {/* Horse name */}
            <div className="space-y-2">
              <label className="block text-emerald-900 font-medium">Horse Name</label>
              <input
                type="text"
                value={horseName}
                onChange={(e) => setHorseName(e.target.value)}
                placeholder="Enter horse name"
                className="w-full px-4 py-3 rounded-lg border-2 border-emerald-200 bg-white text-emerald-900 placeholder-emerald-400 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Grain type */}
            <div className="space-y-2">
              <label className="block text-emerald-900 font-medium">Grain Type</label>
              <div className="space-y-2">
                {GRAIN_TYPES.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setHorseGrainType(type.value)}
                    className={`w-full py-3 px-4 rounded-lg border-2 text-left transition-all ${
                      horseGrainType === type.value
                        ? 'border-emerald-700 bg-emerald-100 text-emerald-900'
                        : 'border-emerald-200 bg-white text-emerald-800 hover:border-emerald-400'
                    }`}
                  >
                    <div className="font-medium">{type.shortLabel}</div>
                    <div className="text-sm text-emerald-600">{type.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Cans per feeding */}
            <div className="space-y-2">
              <label className="block text-emerald-900 font-medium">Cans per Feeding</label>
              <input
                type="number"
                value={horseCansPerFeeding}
                onChange={(e) => setHorseCansPerFeeding(e.target.value)}
                placeholder="1"
                step="0.5"
                min="0"
                className="w-full px-4 py-3 rounded-lg border-2 border-emerald-200 bg-white text-emerald-900 placeholder-emerald-400 focus:border-emerald-500 focus:outline-none"
              />
              <div className="text-sm text-emerald-600">
                Fed twice daily = {((parseFloat(horseCansPerFeeding) || 0) * 2 * getLbsPerCan(horseGrainType)).toFixed(1)} lbs/day
              </div>
            </div>

            {/* Vitamin scoops */}
            <div className="space-y-2">
              <label className="block text-emerald-900 font-medium">Vitamin Scoops per Feeding</label>
              <input
                type="number"
                value={horseVitaminScoops}
                onChange={(e) => setHorseVitaminScoops(e.target.value)}
                placeholder="0"
                step="0.5"
                min="0"
                className="w-full px-4 py-3 rounded-lg border-2 border-emerald-200 bg-white text-emerald-900 placeholder-emerald-400 focus:border-emerald-500 focus:outline-none"
              />
              <div className="text-sm text-emerald-500">Enter 0 if this horse doesn&apos;t get vitamins</div>
            </div>

            {/* Submit button */}
            <button
              onClick={handleAddHorse}
              disabled={submitting || !horseName.trim()}
              className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-400 text-white text-lg font-semibold rounded-xl shadow-lg transition-colors"
            >
              {submitting ? 'Adding...' : 'Add Horse'}
            </button>
          </div>
        )}

        {/* Edit horse view */}
        {view === 'editHorse' && editingHorse && (
          <div className="space-y-6">
            <button
              onClick={handleBackToHorses}
              className="flex items-center gap-2 text-emerald-700 hover:text-emerald-900 transition-colors"
            >
              <ChevronLeft size={20} />
              Back
            </button>

            <h2 className="text-xl font-semibold text-emerald-900">Edit {editingHorse.name}</h2>

            {/* Horse name */}
            <div className="space-y-2">
              <label className="block text-emerald-900 font-medium">Horse Name</label>
              <input
                type="text"
                value={horseName}
                onChange={(e) => setHorseName(e.target.value)}
                placeholder="Enter horse name"
                className="w-full px-4 py-3 rounded-lg border-2 border-emerald-200 bg-white text-emerald-900 placeholder-emerald-400 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Grain type */}
            <div className="space-y-2">
              <label className="block text-emerald-900 font-medium">Grain Type</label>
              <div className="space-y-2">
                {GRAIN_TYPES.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setHorseGrainType(type.value)}
                    className={`w-full py-3 px-4 rounded-lg border-2 text-left transition-all ${
                      horseGrainType === type.value
                        ? 'border-emerald-700 bg-emerald-100 text-emerald-900'
                        : 'border-emerald-200 bg-white text-emerald-800 hover:border-emerald-400'
                    }`}
                  >
                    <div className="font-medium">{type.shortLabel}</div>
                    <div className="text-sm text-emerald-600">{type.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Cans per feeding */}
            <div className="space-y-2">
              <label className="block text-emerald-900 font-medium">Cans per Feeding</label>
              <input
                type="number"
                value={horseCansPerFeeding}
                onChange={(e) => setHorseCansPerFeeding(e.target.value)}
                placeholder="1"
                step="0.5"
                min="0"
                className="w-full px-4 py-3 rounded-lg border-2 border-emerald-200 bg-white text-emerald-900 placeholder-emerald-400 focus:border-emerald-500 focus:outline-none"
              />
              <div className="text-sm text-emerald-600">
                Fed twice daily = {((parseFloat(horseCansPerFeeding) || 0) * 2 * getLbsPerCan(horseGrainType)).toFixed(1)} lbs/day
              </div>
            </div>

            {/* Vitamin scoops */}
            <div className="space-y-2">
              <label className="block text-emerald-900 font-medium">Vitamin Scoops per Feeding</label>
              <input
                type="number"
                value={horseVitaminScoops}
                onChange={(e) => setHorseVitaminScoops(e.target.value)}
                placeholder="0"
                step="0.5"
                min="0"
                className="w-full px-4 py-3 rounded-lg border-2 border-emerald-200 bg-white text-emerald-900 placeholder-emerald-400 focus:border-emerald-500 focus:outline-none"
              />
              <div className="text-sm text-emerald-500">Enter 0 if this horse doesn&apos;t get vitamins</div>
            </div>

            {/* Submit button */}
            <button
              onClick={handleUpdateHorse}
              disabled={submitting || !horseName.trim()}
              className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-400 text-white text-lg font-semibold rounded-xl shadow-lg transition-colors"
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}

        {/* Stats view */}
        {view === 'stats' && (
          <div className="space-y-6">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-emerald-700 hover:text-emerald-900 transition-colors"
            >
              <ChevronLeft size={20} />
              Back
            </button>

            <h2 className="text-xl font-semibold text-emerald-900">Usage Stats</h2>

            {/* Daily usage */}
            <div className="bg-white rounded-xl border border-emerald-200 p-4">
              <h3 className="text-sm font-medium text-emerald-600 mb-3">
                Daily Usage ({stats.activeHorses.length} horse{stats.activeHorses.length !== 1 ? 's' : ''})
              </h3>
              <div className="space-y-3">
                {GRAIN_TYPES.map(type => {
                  const dailyLbs = stats.dailyGrainLbs[type.value];
                  if (dailyLbs === 0) return null;
                  return (
                    <div key={type.value} className="flex items-center justify-between">
                      <div className="text-emerald-800">{type.shortLabel}</div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-emerald-900">{dailyLbs.toFixed(1)}</span>
                        <span className="text-emerald-600 text-sm ml-1">lbs/day</span>
                      </div>
                    </div>
                  );
                })}
                {stats.dailyVitaminScoops > 0 && (
                  <div className="flex items-center justify-between pt-2 border-t border-emerald-100">
                    <div className="text-emerald-800">Vitamins</div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-emerald-900">{stats.dailyVitaminScoops}</span>
                      <span className="text-emerald-600 text-sm ml-1">scoops/day</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Runway projections */}
            <div className="bg-white rounded-xl border border-emerald-200 p-4">
              <h3 className="text-sm font-medium text-emerald-600 mb-3">
                Runway (at current usage)
              </h3>
              <div className="grid grid-cols-4 gap-4">
                {GRAIN_TYPES.map(type => {
                  const runway = stats.runwayDays[type.value];
                  const bags = inventory.grain[type.value];
                  return (
                    <div key={type.value}>
                      <div className={`text-2xl font-bold ${
                        runway === Infinity ? 'text-gray-400' :
                        runway <= 7 ? 'text-red-600' :
                        'text-green-600'
                      }`}>
                        {runway === Infinity ? '—' :
                          runway <= 1 ? '<1' :
                          `${runway}`}
                      </div>
                      <div className="text-xs text-emerald-500">days</div>
                      <div className="text-sm text-emerald-700">{type.shortLabel}</div>
                      <div className="text-xs text-emerald-500 mt-1">
                        {bags.toFixed(1)} bag{bags !== 1 ? 's' : ''}
                      </div>
                    </div>
                  );
                })}
                <div>
                  <div className={`text-2xl font-bold ${
                    stats.vitaminRunwayDays === Infinity ? 'text-gray-400' :
                    stats.vitaminRunwayDays <= 7 ? 'text-red-600' :
                    'text-green-600'
                  }`}>
                    {stats.vitaminRunwayDays === Infinity ? '—' :
                      stats.vitaminRunwayDays <= 1 ? '<1' :
                      `${stats.vitaminRunwayDays}`}
                  </div>
                  <div className="text-xs text-emerald-500">days</div>
                  <div className="text-sm text-emerald-700">Vitamins</div>
                  <div className="text-xs text-emerald-500 mt-1">
                    {inventory.vitamin.toFixed(1)} bag{inventory.vitamin !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            </div>

            {/* Weekly/Monthly usage */}
            <div className="bg-white rounded-xl border border-emerald-200 p-4">
              <h3 className="text-sm font-medium text-emerald-600 mb-3">
                Projected Usage
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-emerald-500 mb-2">Per Week</div>
                  <div className="grid grid-cols-4 gap-2">
                    {GRAIN_TYPES.map(type => {
                      const bags = stats.weeklyBags[type.value];
                      if (bags === 0) return (
                        <div key={type.value} className="text-center text-gray-400">—</div>
                      );
                      return (
                        <div key={type.value} className="text-center">
                          <span className="font-bold text-emerald-900">{bags.toFixed(1)}</span>
                          <span className="text-emerald-600 text-sm ml-1">bags</span>
                          <div className="text-xs text-emerald-500">{type.shortLabel}</div>
                        </div>
                      );
                    })}
                    {stats.vitaminBagsPerDay * 7 === 0 ? (
                      <div className="text-center text-gray-400">—</div>
                    ) : (
                      <div className="text-center">
                        <span className="font-bold text-emerald-900">{(stats.vitaminBagsPerDay * 7).toFixed(1)}</span>
                        <span className="text-emerald-600 text-sm ml-1">bags</span>
                        <div className="text-xs text-emerald-500">Vitamins</div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="pt-4 border-t border-emerald-100">
                  <div className="text-xs text-emerald-500 mb-2">Per Month</div>
                  <div className="grid grid-cols-4 gap-2">
                    {GRAIN_TYPES.map(type => {
                      const bags = stats.monthlyBags[type.value];
                      if (bags === 0) return (
                        <div key={type.value} className="text-center text-gray-400">—</div>
                      );
                      return (
                        <div key={type.value} className="text-center">
                          <span className="font-bold text-emerald-900">{bags.toFixed(1)}</span>
                          <span className="text-emerald-600 text-sm ml-1">bags</span>
                          <div className="text-xs text-emerald-500">{type.shortLabel}</div>
                        </div>
                      );
                    })}
                    {stats.vitaminBagsPerDay * 30 === 0 ? (
                      <div className="text-center text-gray-400">—</div>
                    ) : (
                      <div className="text-center">
                        <span className="font-bold text-emerald-900">{(stats.vitaminBagsPerDay * 30).toFixed(1)}</span>
                        <span className="text-emerald-600 text-sm ml-1">bags</span>
                        <div className="text-xs text-emerald-500">Vitamins</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Per-horse consumption */}
            {stats.horseConsumption.length > 0 && (
              <div className="bg-white rounded-xl border border-emerald-200 p-4">
                <h3 className="text-sm font-medium text-emerald-600 mb-3">
                  Per-Horse Consumption
                </h3>
                <div className="space-y-2">
                  {stats.horseConsumption.map(({ horse, dailyLbs, dailyCans }) => (
                    <div
                      key={horse.id}
                      className="flex items-center justify-between py-2 border-b border-emerald-100 last:border-0"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-emerald-900">{horse.name}</div>
                        <div className="text-xs text-emerald-500">
                          {dailyCans} cans/day · {getGrainTypeLabel(horse.grain_type, true)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-emerald-700">
                          {dailyLbs.toFixed(1)}
                        </div>
                        <div className="text-xs text-emerald-500">lbs/day</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {stats.activeHorses.length === 0 && (
              <div className="bg-white rounded-xl border border-emerald-200 p-6 text-center text-emerald-600">
                No active horses.
                <br />
                <span className="text-sm text-emerald-500">Add horses to see usage projections.</span>
              </div>
            )}
          </div>
        )}

        {/* Missed feeding view */}
        {view === 'missedFeeding' && (
          <div className="space-y-6 pb-24">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-emerald-700 hover:text-emerald-900 transition-colors"
            >
              <ChevronLeft size={20} />
              Back
            </button>

            <h2 className="text-xl font-semibold text-emerald-900">Missed Feeding</h2>
            <p className="text-emerald-600 text-sm">Select which horses missed a feeding today.</p>

            {/* All Horses button */}
            <button
              onClick={() => handleMissedFeeding('all')}
              disabled={submitting || stats.activeHorses.length === 0}
              className="w-full py-4 px-6 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white text-lg font-semibold rounded-xl shadow-lg transition-colors"
            >
              {submitting ? 'Saving...' : 'All Horses'}
            </button>

            {/* Individual horses - multi-select */}
            {stats.activeHorses.length > 0 && (
              <div className="space-y-2">
                {stats.activeHorses.map(horse => {
                  const isSelected = selectedHorseIds.has(horse.id);
                  return (
                    <button
                      key={horse.id}
                      onClick={() => toggleHorseSelection(horse.id)}
                      disabled={submitting}
                      className={`w-full rounded-lg border-2 p-4 text-left transition-all disabled:opacity-50 ${
                        isSelected
                          ? 'bg-amber-100 border-amber-500'
                          : 'bg-white hover:bg-amber-50 border-amber-200 hover:border-amber-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-emerald-900 text-lg">{horse.name}</div>
                          <div className="text-sm text-emerald-600">
                            {horse.cans_per_feeding} can{horse.cans_per_feeding !== 1 ? 's' : ''} {getGrainTypeLabel(horse.grain_type, true)}
                          </div>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          isSelected
                            ? 'bg-amber-600 border-amber-600'
                            : 'border-amber-300'
                        }`}>
                          {isSelected && <Check size={14} className="text-white" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Confirm button - fixed at bottom */}
            {selectedHorseIds.size > 0 && (
              <div className="fixed bottom-0 left-0 right-0 p-4 bg-emerald-50 border-t border-emerald-200">
                <div className="max-w-md mx-auto">
                  <button
                    onClick={() => handleMissedFeeding(Array.from(selectedHorseIds))}
                    disabled={submitting}
                    className="w-full py-4 px-6 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white text-lg font-semibold rounded-xl shadow-lg transition-colors"
                  >
                    {submitting ? 'Saving...' : `Record Missed Feeding (${selectedHorseIds.size})`}
                  </button>
                </div>
              </div>
            )}

            {stats.activeHorses.length === 0 && (
              <div className="text-center py-8 text-emerald-600">
                No active horses.
              </div>
            )}
          </div>
        )}

        {/* Activity view - all transactions */}
        {view === 'activity' && (
          <div className="space-y-6">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-emerald-700 hover:text-emerald-900 transition-colors"
            >
              <ChevronLeft size={20} />
              Back
            </button>

            <h2 className="text-xl font-semibold text-emerald-900">All Activity ({transactions.length})</h2>

            <div className="space-y-2">
              {transactions.map(tx => {
                const isBought = tx.transaction_type === 'bought';
                const isHorseAdded = tx.transaction_type === 'horse_added';
                const isHorseUpdated = tx.transaction_type === 'horse_updated';
                const isHorseRemoved = tx.transaction_type === 'horse_removed';
                const isHalfFeeding = tx.transaction_type === 'half_feeding';

                return (
                  <div
                    key={tx.id}
                    className="bg-white rounded-lg border border-emerald-200 p-3 flex items-center gap-3"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isBought ? 'bg-green-100 text-green-700' :
                      isHorseAdded ? 'bg-blue-100 text-blue-700' :
                      isHorseUpdated ? 'bg-amber-100 text-amber-700' :
                      isHorseRemoved ? 'bg-red-100 text-red-700' :
                      isHalfFeeding ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {isBought && <Plus size={16} />}
                      {isHorseAdded && <Users size={16} />}
                      {isHorseUpdated && <Pencil size={16} />}
                      {isHorseRemoved && <Trash2 size={16} />}
                      {isHalfFeeding && <Minus size={16} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      {isBought && (
                        <div className="text-sm text-emerald-900">
                          <span className="font-medium">+{tx.quantity}</span>
                          {' '}
                          {tx.item_type === 'grain'
                            ? getGrainTypeLabel(tx.grain_type, true)
                            : 'Vitamin'
                          }
                          {' bag'}{tx.quantity > 1 ? 's' : ''}
                        </div>
                      )}
                      {isHorseAdded && (
                        <div className="text-sm text-emerald-900">
                          <span className="font-medium">Added {tx.horse_name}</span>
                          {tx.details && <span className="text-emerald-600"> ({tx.details})</span>}
                        </div>
                      )}
                      {isHorseUpdated && (
                        <div className="text-sm text-emerald-900">
                          <span className="font-medium">Updated {tx.horse_name}</span>
                          {tx.details && <span className="text-emerald-600"> ({tx.details})</span>}
                        </div>
                      )}
                      {isHorseRemoved && (
                        <div className="text-sm text-emerald-900">
                          <span className="font-medium">Removed {tx.horse_name}</span>
                        </div>
                      )}
                      {isHalfFeeding && (
                        <div className="text-sm text-emerald-900">
                          <span className="font-medium">Missed feeding</span>
                          {tx.details === 'Horses fed once' ? (
                            <span className="text-emerald-600"> (all horses)</span>
                          ) : tx.details && (
                            <span className="text-emerald-600"> ({tx.details.replace(' missed feeding', '')})</span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-emerald-500 whitespace-nowrap">
                      {formatDate(tx.created_at)}
                    </div>
                  </div>
                );
              })}
            </div>

            {transactions.length === 0 && (
              <div className="text-center py-8 text-emerald-600">
                No activity yet.
              </div>
            )}
          </div>
        )}

        {/* Settings view */}
        {view === 'settings' && (
          <div className="space-y-6">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-emerald-700 hover:text-emerald-900 transition-colors"
            >
              <ChevronLeft size={20} />
              Back
            </button>

            <h2 className="text-xl font-semibold text-emerald-900">Settings</h2>

            {/* Grain weights */}
            <div className="bg-white rounded-xl border border-emerald-200 p-4">
              <h3 className="text-sm font-medium text-emerald-600 mb-4">Grain Weight (lbs per can)</h3>
              <div className="space-y-4">
                {GRAIN_TYPES.map(type => (
                  <div key={type.value} className="flex items-center justify-between gap-4">
                    <label className="text-emerald-900 flex-1">{type.shortLabel}</label>
                    <input
                      type="number"
                      value={editSettings[`lbs_per_can_${type.value}` as keyof GrainSettings]}
                      onChange={(e) => setEditSettings({
                        ...editSettings,
                        [`lbs_per_can_${type.value}`]: parseFloat(e.target.value) || 0,
                      })}
                      step="0.1"
                      min="0"
                      className="w-24 px-3 py-2 rounded-lg border-2 border-emerald-200 bg-white text-emerald-900 text-right focus:border-emerald-500 focus:outline-none"
                    />
                    <span className="text-emerald-600 text-sm w-8">lbs</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Vitamin weight */}
            <div className="bg-white rounded-xl border border-emerald-200 p-4">
              <h3 className="text-sm font-medium text-emerald-600 mb-4">Vitamin Weight</h3>
              <div className="flex items-center justify-between gap-4">
                <label className="text-emerald-900 flex-1">Lbs per scoop</label>
                <input
                  type="number"
                  value={editSettings.lbs_per_scoop_vitamin}
                  onChange={(e) => setEditSettings({
                    ...editSettings,
                    lbs_per_scoop_vitamin: parseFloat(e.target.value) || 0,
                  })}
                  step="0.01"
                  min="0"
                  className="w-24 px-3 py-2 rounded-lg border-2 border-emerald-200 bg-white text-emerald-900 text-right focus:border-emerald-500 focus:outline-none"
                />
                <span className="text-emerald-600 text-sm w-8">lbs</span>
              </div>
            </div>

            {/* Bag sizes */}
            <div className="bg-white rounded-xl border border-emerald-200 p-4">
              <h3 className="text-sm font-medium text-emerald-600 mb-4">Bag Sizes</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <label className="text-emerald-900 flex-1">Grain bag size</label>
                  <input
                    type="number"
                    value={editSettings.bag_size_grain}
                    onChange={(e) => setEditSettings({
                      ...editSettings,
                      bag_size_grain: parseFloat(e.target.value) || 0,
                    })}
                    step="1"
                    min="1"
                    className="w-24 px-3 py-2 rounded-lg border-2 border-emerald-200 bg-white text-emerald-900 text-right focus:border-emerald-500 focus:outline-none"
                  />
                  <span className="text-emerald-600 text-sm w-8">lbs</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <label className="text-emerald-900 flex-1">Vitamin bag size</label>
                  <input
                    type="number"
                    value={editSettings.bag_size_vitamin}
                    onChange={(e) => setEditSettings({
                      ...editSettings,
                      bag_size_vitamin: parseFloat(e.target.value) || 0,
                    })}
                    step="0.5"
                    min="0.1"
                    className="w-24 px-3 py-2 rounded-lg border-2 border-emerald-200 bg-white text-emerald-900 text-right focus:border-emerald-500 focus:outline-none"
                  />
                  <span className="text-emerald-600 text-sm w-8">lbs</span>
                </div>
              </div>
            </div>

            {/* Save button */}
            <button
              onClick={handleSaveSettings}
              disabled={submitting}
              className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-400 text-white text-lg font-semibold rounded-xl shadow-lg transition-colors"
            >
              {submitting ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
