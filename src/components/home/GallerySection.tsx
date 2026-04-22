'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Image, X, Facebook } from 'lucide-react';
import { GalleryItem } from '@/types';

// Helper function to check if URL is a Facebook video
const isFacebookVideo = (url: string): boolean => {
  return /(?:facebook\.com|fb\.watch)\/(?:reel|watch|.*\/videos)/.test(url);
};

// Helper function to get embed URL from video URL
const getEmbedUrl = (url: string): string | null => {
  const youtubeMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/|v\/)|youtu\.be\/)([\w-]+)/);
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }

  const vimeoMatch = url.match(/(?:vimeo\.com\/(?:video\/)?|player\.vimeo\.com\/video\/)(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  if (isFacebookVideo(url)) {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false`;
  }

  return null;
};

// Helper function to get video thumbnail
const getVideoThumbnail = (url: string): string | null => {
  const youtubeMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/|v\/)|youtu\.be\/)([\w-]+)/);
  if (youtubeMatch) {
    return `https://img.youtube.com/vi/${youtubeMatch[1]}/mqdefault.jpg`;
  }
  return null;
};

interface GallerySectionProps {
  galleryItems: GalleryItem[];
}

export default function GallerySection({ galleryItems }: GallerySectionProps) {
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [galleryModalItem, setGalleryModalItem] = useState<GalleryItem | null>(null);

  const nextGallerySlide = () => {
    setGalleryIndex((prev) => (prev + 1) % galleryItems.length);
  };

  const prevGallerySlide = () => {
    setGalleryIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
  };

  // Auto-scroll gallery (skip videos)
  useEffect(() => {
    if (galleryItems.length <= 1) return;

    const findNextPhotoIndex = (currentIndex: number): number => {
      let nextIndex = (currentIndex + 1) % galleryItems.length;
      let checked = 0;
      while (galleryItems[nextIndex]?.media_type === 'video' && checked < galleryItems.length) {
        nextIndex = (nextIndex + 1) % galleryItems.length;
        checked++;
      }
      return nextIndex;
    };

    const currentItem = galleryItems[galleryIndex];
    if (currentItem?.media_type === 'video') {
      const nextPhotoIndex = findNextPhotoIndex(galleryIndex);
      if (nextPhotoIndex !== galleryIndex) {
        const timeout = setTimeout(() => {
          setGalleryIndex(nextPhotoIndex);
        }, 8000);
        return () => clearTimeout(timeout);
      }
      return;
    }

    const interval = setInterval(() => {
      setGalleryIndex(findNextPhotoIndex(galleryIndex));
    }, 5000);

    return () => clearInterval(interval);
  }, [galleryItems, galleryIndex]);

  return (
    <>
      <section id="gallery" className="py-20 px-4 bg-stone-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Our <span className="text-red-500">Gallery</span>
            </h2>
            <p className="text-stone-400 max-w-2xl mx-auto">
              A glimpse into life at Decode Horsemanship - our horses, our work, and our community.
            </p>
          </div>

          {galleryItems.length > 0 ? (
            <div className="relative">
              {/* Main Carousel */}
              <div className="relative overflow-hidden rounded-2xl bg-stone-900/50 border border-stone-800">
                <div
                  className={`relative ${
                    galleryItems[galleryIndex]?.media_type === 'video' &&
                    isFacebookVideo(galleryItems[galleryIndex]?.media_url || '')
                      ? 'aspect-[9/16] max-h-[70vh] mx-auto'
                      : 'aspect-[2/1]'
                  }`}
                >
                  {galleryItems[galleryIndex]?.media_type === 'photo' ? (
                    <img
                      src={galleryItems[galleryIndex]?.media_url}
                      alt={galleryItems[galleryIndex]?.title || 'Gallery image'}
                      className="w-full h-full object-contain bg-black/50 cursor-pointer"
                      onClick={() => setGalleryModalItem(galleryItems[galleryIndex])}
                    />
                  ) : isFacebookVideo(galleryItems[galleryIndex]?.media_url || '') ? (
                    <iframe
                      src={getEmbedUrl(galleryItems[galleryIndex]?.media_url || '') || ''}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={galleryItems[galleryIndex]?.title || 'Gallery video'}
                    />
                  ) : (
                    <div className="w-full h-full">
                      <iframe
                        src={getEmbedUrl(galleryItems[galleryIndex]?.media_url || '') || ''}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={galleryItems[galleryIndex]?.title || 'Gallery video'}
                      />
                    </div>
                  )}

                  {/* Caption overlay */}
                  {(galleryItems[galleryIndex]?.title || galleryItems[galleryIndex]?.description) && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent pt-10 sm:pt-6 px-6 pb-6">
                      {galleryItems[galleryIndex]?.title && (
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white drop-shadow-md text-center mb-1">
                          {galleryItems[galleryIndex].title}
                        </h3>
                      )}
                      {galleryItems[galleryIndex]?.description && (
                        <div
                          className="text-stone-300 text-center prose prose-invert prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: galleryItems[galleryIndex].description }}
                        />
                      )}
                    </div>
                  )}

                  {/* Navigation arrows */}
                  {galleryItems.length > 1 && (
                    <>
                      <button
                        onClick={prevGallerySlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-red-700 rounded-full transition-colors"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button
                        onClick={nextGallerySlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-red-700 rounded-full transition-colors"
                      >
                        <ChevronRight size={24} />
                      </button>
                    </>
                  )}

                  {/* Media type indicator */}
                  <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 rounded-full flex items-center gap-2">
                    {galleryItems[galleryIndex]?.media_type === 'video' ? (
                      <>
                        <Play size={14} className="fill-current" />
                        <span className="text-sm">Video</span>
                      </>
                    ) : (
                      <>
                        <Image size={14} />
                        <span className="text-sm">Photo</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Thumbnail strip */}
              {galleryItems.length > 1 && (
                <div className="mt-4 flex gap-2 overflow-x-auto pb-2 justify-center">
                  {galleryItems.map((item, idx) => (
                    <button
                      key={item.id}
                      onClick={() => setGalleryIndex(idx)}
                      className={`w-20 h-14 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors relative ${
                        idx === galleryIndex ? 'border-red-500' : 'border-transparent hover:border-stone-600'
                      }`}
                    >
                      {item.media_type === 'photo' ? (
                        <img src={item.media_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-stone-700 flex items-center justify-center relative">
                          {getVideoThumbnail(item.media_url) ? (
                            <img
                              src={getVideoThumbnail(item.media_url)!}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : isFacebookVideo(item.media_url) ? (
                            <Facebook size={20} className="text-blue-500" />
                          ) : (
                            <Play size={20} className="text-stone-400" />
                          )}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <Play size={16} className="fill-current text-white" />
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Dot indicators */}
              {galleryItems.length > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  {galleryItems.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setGalleryIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        idx === galleryIndex ? 'bg-red-500' : 'bg-stone-600 hover:bg-stone-500'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-stone-500">
              <Image size={48} className="mx-auto mb-4 opacity-50" />
              <p>No gallery items yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Gallery Modal */}
      {galleryModalItem && galleryModalItem.media_type === 'photo' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          onClick={() => setGalleryModalItem(null)}
        >
          <button
            onClick={() => setGalleryModalItem(null)}
            className="absolute top-4 right-4 p-2 bg-black/50 rounded-full hover:bg-red-700 transition-colors"
          >
            <X size={24} />
          </button>
          <img
            src={galleryModalItem.media_url}
            alt={galleryModalItem.title || 'Gallery image'}
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          {(galleryModalItem.title || galleryModalItem.description) && (
            <div className="absolute bottom-12 left-0 right-0 flex justify-center">
              <div className="max-w-[90%] sm:max-w-[70%] text-center">
                {galleryModalItem.title && (
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white drop-shadow-md mb-1">
                    {galleryModalItem.title}
                  </h3>
                )}
                {galleryModalItem.description && (
                  <div
                    className="text-sm sm:text-base text-stone-300 drop-shadow-sm prose prose-invert prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: galleryModalItem.description }}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
