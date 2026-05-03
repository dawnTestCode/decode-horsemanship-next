'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Heart, Filter, Loader2, Video } from 'lucide-react';
import { Horse } from '@/types';
import { formatPrice } from '@/lib/utils';

interface HorsesSectionProps {
  horses: Horse[];
  loading: boolean;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export default function HorsesSection({
  horses,
  loading,
  favorites,
  onToggleFavorite,
}: HorsesSectionProps) {
  const [filters, setFilters] = useState({
    temperament: 'All',
    experience: 'All',
    training: 'All',
  });
  const [showFilters, setShowFilters] = useState(false);

  // Filter for available horses (excluding not_for_sale)
  const filteredHorses = horses.filter((horse) => {
    if (horse.status === 'not_for_sale') return false;
    if (filters.temperament !== 'All' && horse.temperament !== filters.temperament) return false;
    if (filters.experience !== 'All' && horse.experience_level !== filters.experience) return false;
    if (filters.training !== 'All' && horse.training_status !== filters.training) return false;
    return true;
  });

  // Filter for our horses (only not_for_sale)
  const ourHorses = horses.filter((horse) => horse.status === 'not_for_sale');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="absolute top-3 left-3 px-3 py-1 bg-yellow-600 text-yellow-100 text-xs font-semibold rounded-full">
            Sale Pending
          </span>
        );
      case 'sold':
        return (
          <span className="absolute top-3 left-3 px-3 py-1 bg-stone-700 text-stone-300 text-xs font-semibold rounded-full">
            Sold
          </span>
        );
      case 'not_for_sale':
        return (
          <span className="absolute top-3 left-3 px-3 py-1 bg-blue-700 text-blue-100 text-xs font-semibold rounded-full">
            Not For Sale
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Available Horses Section */}
      <section id="horses" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-red-500">Available</span> Horses
            </h2>
            <p className="text-stone-400 max-w-2xl mx-auto">
              Each of these horses has been rescued, rehabilitated, and is ready to find their forever home.
              Click on any horse to learn more about their story.
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 rounded-lg text-stone-300 mb-4"
            >
              <Filter size={18} />
              Filter Horses
              <ChevronDown
                className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`}
                size={18}
              />
            </button>

            {showFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-stone-900/50 rounded-lg">
                <div>
                  <label className="block text-sm text-stone-400 mb-2">Temperament</label>
                  <select
                    value={filters.temperament}
                    onChange={(e) => setFilters({ ...filters, temperament: e.target.value })}
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-2 text-stone-200"
                  >
                    <option>All</option>
                    <option>Calm</option>
                    <option>Moderate</option>
                    <option>Spirited</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-stone-400 mb-2">Experience Level</label>
                  <select
                    value={filters.experience}
                    onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-2 text-stone-200"
                  >
                    <option>All</option>
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-stone-400 mb-2">Training Status</label>
                  <select
                    value={filters.training}
                    onChange={(e) => setFilters({ ...filters, training: e.target.value })}
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-2 text-stone-200"
                  >
                    <option>All</option>
                    <option>Green</option>
                    <option>In Training</option>
                    <option>Trained</option>
                    <option>Well Trained</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Horse Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-red-500" size={40} />
            </div>
          ) : filteredHorses.length === 0 ? (
            <div className="text-center py-12 text-stone-500">
              {horses.length === 0
                ? 'No horses available at this time. Check back soon!'
                : 'No horses match your current filters. Try adjusting your criteria.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredHorses.map((horse) => (
                <Link
                  key={horse.id}
                  href={`/horses/${horse.id}`}
                  className={`group bg-stone-900/50 rounded-xl overflow-hidden border transition-all duration-300 cursor-pointer ${
                    horse.status === 'sold'
                      ? 'border-stone-800 opacity-75'
                      : horse.status === 'not_for_sale'
                      ? 'border-blue-800/50 hover:border-blue-600'
                      : 'border-stone-800 hover:border-red-700'
                  }`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {horse.photos && horse.photos.length > 0 ? (
                      <img
                        src={horse.photos[0]}
                        alt={horse.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-stone-800 flex items-center justify-center text-stone-600">
                        No Photo
                      </div>
                    )}
                    {getStatusBadge(horse.status)}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onToggleFavorite(horse.id);
                      }}
                      className="absolute top-3 right-3 p-2 bg-black/50 rounded-full hover:bg-red-700 transition-colors"
                    >
                      <Heart
                        size={20}
                        className={favorites.includes(horse.id) ? 'fill-red-500 text-red-500' : 'text-white'}
                      />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-red-700 px-2 py-1 rounded">{horse.training_status}</span>
                        {horse.videos && horse.videos.length > 0 && (
                          <span className="text-xs bg-stone-700 px-2 py-1 rounded flex items-center gap-1">
                            <Video size={12} />
                            {horse.videos.length}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-stone-100">{horse.name}</h3>
                      {horse.status !== 'not_for_sale' && (
                        <span className="text-red-500 font-bold">{formatPrice(horse.price)}</span>
                      )}
                    </div>
                    <p className="text-stone-400 text-sm mb-3">
                      {horse.age} yr old {horse.gender} &bull; {horse.breed}
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <span className="text-xs bg-stone-800 px-2 py-1 rounded text-stone-300">
                        {horse.temperament}
                      </span>
                      <span className="text-xs bg-stone-800 px-2 py-1 rounded text-stone-300">
                        {horse.experience_level} Riders
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Our Horses Section (Not For Sale) */}
      {ourHorses.length > 0 && (
        <section id="our-horses" className="py-20 px-4 bg-stone-900/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="text-blue-500">Our</span> Horses
              </h2>
              <p className="text-stone-400 max-w-2xl mx-auto">
                These horses are part of our family and not available for sale. They help us with training,
                demonstrations, and remind us every day why we do what we do.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {ourHorses.map((horse) => (
                <Link
                  key={horse.id}
                  href={`/horses/${horse.id}`}
                  className="group bg-stone-900/50 rounded-xl overflow-hidden border border-blue-800/30 hover:border-blue-600 transition-all duration-300 cursor-pointer"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {horse.photos && horse.photos.length > 0 ? (
                      <img
                        src={horse.photos[0]}
                        alt={horse.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-stone-800 flex items-center justify-center text-stone-600">
                        No Photo
                      </div>
                    )}
                    {getStatusBadge(horse.status)}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onToggleFavorite(horse.id);
                      }}
                      className="absolute top-3 right-3 p-2 bg-black/50 rounded-full hover:bg-blue-700 transition-colors"
                    >
                      <Heart
                        size={20}
                        className={favorites.includes(horse.id) ? 'fill-blue-500 text-blue-500' : 'text-white'}
                      />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-blue-700 px-2 py-1 rounded">{horse.training_status}</span>
                        {horse.videos && horse.videos.length > 0 && (
                          <span className="text-xs bg-stone-700 px-2 py-1 rounded flex items-center gap-1">
                            <Video size={12} />
                            {horse.videos.length}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-stone-100 mb-2">{horse.name}</h3>
                    <p className="text-stone-400 text-sm mb-3">
                      {horse.age} yr old {horse.gender} &bull; {horse.breed}
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <span className="text-xs bg-stone-800 px-2 py-1 rounded text-stone-300">
                        {horse.temperament}
                      </span>
                      <span className="text-xs bg-stone-800 px-2 py-1 rounded text-stone-300">
                        {horse.experience_level} Riders
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
