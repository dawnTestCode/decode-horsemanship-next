'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Heart, Image, Video, Play } from 'lucide-react';
import { siteConfig } from '@/config/siteConfig';
import { formatPrice } from '@/lib/utils';

interface Horse {
  id: string;
  name: string;
  breed: string;
  age: number;
  gender: string;
  height: string;
  price: string;
  temperament: string;
  training_status: string;
  experience_level: string;
  photos: string[];
  videos?: string[];
  story?: string;
  status: 'available' | 'pending' | 'sold' | 'not_for_sale';
}

// Clean up HTML content - convert non-breaking spaces to regular spaces
const cleanHtmlContent = (html: string): string => {
  if (!html) return '';
  return html.replace(/&nbsp;/g, ' ');
};

const getEmbedUrl = (url: string): string | null => {
  // YouTube
  const youtubeMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }
  // Facebook
  if (url.includes('facebook.com') || url.includes('fb.watch')) {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false`;
  }
  return null;
};

const getVideoThumbnail = (url: string): string | null => {
  const youtubeMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (youtubeMatch) {
    return `https://img.youtube.com/vi/${youtubeMatch[1]}/mqdefault.jpg`;
  }
  return null;
};

export default function HorseDetailClient({ horse }: { horse: Horse }) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const [mediaTab, setMediaTab] = useState<'photos' | 'videos'>('photos');
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('favorites');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  const toggleFavorite = (horseId: string) => {
    const updated = favorites.includes(horseId)
      ? favorites.filter(id => id !== horseId)
      : [...favorites, horseId];
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  const getStatusBadge = (status: string) => {
    if (status === 'pending') {
      return (
        <div className="absolute top-4 left-4 z-10 bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
          Sale Pending
        </div>
      );
    }
    if (status === 'sold') {
      return (
        <div className="absolute top-4 left-4 z-10 bg-stone-700 text-white px-3 py-1 rounded-full text-sm font-semibold">
          Sold
        </div>
      );
    }
    if (status === 'not_for_sale') {
      return (
        <div className="absolute top-4 left-4 z-10 bg-blue-700 text-white px-3 py-1 rounded-full text-sm font-semibold">
          Not For Sale
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-stone-950/95 backdrop-blur-sm border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-stone-300 hover:text-white transition-colors">
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </Link>
          <Link href="/" className="text-xl font-bold">
            <span className="text-red-500">Decode</span> Horsemanship
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Media Section */}
          <div className="relative rounded-2xl overflow-hidden bg-stone-900 border border-stone-800">
            {/* Tab Buttons */}
            {((horse.photos && horse.photos.length > 0) || (horse.videos && horse.videos.length > 0)) && (
              <div className="absolute top-4 left-4 z-20 flex gap-2">
                {horse.photos && horse.photos.length > 0 && (
                  <button
                    onClick={() => setMediaTab('photos')}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      mediaTab === 'photos'
                        ? 'bg-red-700 text-white'
                        : 'bg-black/50 text-stone-300 hover:bg-black/70'
                    }`}
                  >
                    <Image size={16} />
                    Photos ({horse.photos.length})
                  </button>
                )}
                {horse.videos && horse.videos.length > 0 && (
                  <button
                    onClick={() => setMediaTab('videos')}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      mediaTab === 'videos'
                        ? 'bg-red-700 text-white'
                        : 'bg-black/50 text-stone-300 hover:bg-black/70'
                    }`}
                  >
                    <Video size={16} />
                    Videos ({horse.videos.length})
                  </button>
                )}
              </div>
            )}

            {/* Photos View */}
            {mediaTab === 'photos' && horse.photos && horse.photos.length > 0 ? (
              <>
                <img
                  src={horse.photos[selectedPhotoIndex]}
                  alt={horse.name}
                  className="w-full aspect-video object-contain bg-black/50"
                />
                {horse.photos.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {horse.photos.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedPhotoIndex(idx)}
                        className={`w-2.5 h-2.5 rounded-full transition-colors ${idx === selectedPhotoIndex ? 'bg-red-500' : 'bg-white/50 hover:bg-white/70'}`}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : mediaTab === 'videos' && horse.videos && horse.videos.length > 0 ? (
              <div className="aspect-video bg-black">
                <iframe
                  src={getEmbedUrl(horse.videos[selectedVideoIndex]) || ''}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={`${horse.name} video ${selectedVideoIndex + 1}`}
                />
              </div>
            ) : (
              <div className="aspect-video bg-gradient-to-br from-stone-800 to-stone-900 flex items-center justify-center">
                <span className="text-stone-600 text-lg">No media available</span>
              </div>
            )}

            {getStatusBadge(horse.status)}
          </div>

          {/* Photo Thumbnails */}
          {mediaTab === 'photos' && horse.photos && horse.photos.length > 1 && (
            <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
              {horse.photos.map((photo, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedPhotoIndex(idx)}
                  className={`w-20 h-14 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${idx === selectedPhotoIndex ? 'border-red-500' : 'border-transparent hover:border-stone-600'}`}
                >
                  <img src={photo} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Video Thumbnails */}
          {mediaTab === 'videos' && horse.videos && horse.videos.length > 1 && (
            <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
              {horse.videos.map((video, idx) => {
                const thumbnail = getVideoThumbnail(video);
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedVideoIndex(idx)}
                    className={`w-20 h-14 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors relative ${idx === selectedVideoIndex ? 'border-red-500' : 'border-transparent hover:border-stone-600'}`}
                  >
                    {thumbnail ? (
                      <img src={thumbnail} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-stone-800 flex items-center justify-center">
                        <Video size={16} className="text-stone-500" />
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Play size={16} className="text-white fill-white" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Horse Details */}
          <div className="mt-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-stone-100">{horse.name}</h1>
                <p className="text-stone-400">
                  {horse.age} year old {horse.gender} &bull; {horse.breed} &bull; {horse.height}
                </p>
              </div>
              {horse.status !== 'not_for_sale' && (
                <span className="text-2xl text-red-500 font-bold">{formatPrice(horse.price)}</span>
              )}
            </div>

            <div className="flex gap-2 mb-6 flex-wrap">
              <span className="bg-red-700 px-3 py-1 rounded-full text-sm">{horse.training_status}</span>
              <span className="bg-stone-800 px-3 py-1 rounded-full text-sm">{horse.temperament}</span>
              <span className="bg-stone-800 px-3 py-1 rounded-full text-sm">{horse.experience_level} Rider</span>
              {horse.videos && horse.videos.length > 0 && (
                <span className="bg-stone-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  <Video size={14} />
                  {horse.videos.length} Video{horse.videos.length > 1 ? 's' : ''}
                </span>
              )}
              {horse.status === 'pending' && (
                <span className="bg-yellow-700 px-3 py-1 rounded-full text-sm">Sale Pending</span>
              )}
              {horse.status === 'sold' && (
                <span className="bg-stone-700 px-3 py-1 rounded-full text-sm">Sold</span>
              )}
              {horse.status === 'not_for_sale' && (
                <span className="bg-blue-700 px-3 py-1 rounded-full text-sm">Not For Sale</span>
              )}
            </div>

            {horse.story && (
              <>
                <h2 className="text-lg font-semibold text-stone-200 mb-2">Story</h2>
                <div
                  className="text-stone-400 mb-6 prose prose-invert prose-sm max-w-none prose-a:text-red-500 break-words"
                  style={{ wordWrap: 'break-word', overflowWrap: 'break-word', whiteSpace: 'normal' }}
                  dangerouslySetInnerHTML={{ __html: cleanHtmlContent(horse.story) }}
                />
              </>
            )}

            <div className="flex gap-4">
              {horse.status === 'available' && (
                <Link
                  href="/#contact"
                  className="flex-1 px-6 py-3 bg-red-700 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors text-center"
                >
                  Inquire About {horse.name}
                </Link>
              )}
              {horse.status === 'pending' && (
                <Link
                  href="/#contact"
                  className="flex-1 px-6 py-3 bg-yellow-700 hover:bg-yellow-600 text-white font-semibold rounded-lg transition-colors text-center"
                >
                  Join Waitlist for {horse.name}
                </Link>
              )}
              {horse.status === 'sold' && (
                <div className="flex-1 px-6 py-3 bg-stone-800 text-stone-400 font-semibold rounded-lg text-center">
                  This horse has found their forever home
                </div>
              )}
              {horse.status === 'not_for_sale' && (
                <div className="flex-1 px-6 py-3 bg-blue-900/50 text-blue-200 font-semibold rounded-lg text-center border border-blue-800">
                  This horse is not for sale
                </div>
              )}

              <button
                onClick={() => toggleFavorite(horse.id)}
                className={`px-6 py-3 border rounded-lg transition-colors ${
                  favorites.includes(horse.id)
                    ? 'border-red-500 text-red-500'
                    : 'border-stone-600 text-stone-300 hover:border-red-500 hover:text-red-500'
                }`}
              >
                <Heart className={favorites.includes(horse.id) ? 'fill-current' : ''} size={20} />
              </button>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-12 p-6 bg-stone-900/50 rounded-xl border border-stone-800">
            <h3 className="text-lg font-semibold mb-4">Have Questions?</h3>
            <p className="text-stone-400 mb-4">
              Contact us directly to learn more about {horse.name}.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href={`tel:${siteConfig.contact.phone}`}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors"
              >
                Call: {siteConfig.contact.phone}
              </a>
              <a
                href={`mailto:${siteConfig.contact.email}?subject=Inquiry about ${horse.name}`}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors"
              >
                Email Us
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
