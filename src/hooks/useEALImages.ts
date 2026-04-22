import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface EALImage {
  id: string;
  image_key: string;
  title: string;
  description: string | null;
  image_url: string | null;
  focal_x: number;
  focal_y: number;
  is_visible: boolean;
}

interface UseEALImagesResult {
  images: Record<string, EALImage>;
  loading: boolean;
  getImage: (key: string) => EALImage | null;
  getImageUrl: (key: string) => string | null;
  getImageStyle: (key: string) => React.CSSProperties;
}

export function useEALImages(): UseEALImagesResult {
  const [images, setImages] = useState<Record<string, EALImage>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchImages() {
      try {
        const { data, error } = await supabase
          .from('eal_images')
          .select('*')
          .eq('is_visible', true);

        if (error) throw error;

        const imageMap: Record<string, EALImage> = {};
        data?.forEach((img) => {
          imageMap[img.image_key] = img;
        });
        setImages(imageMap);
      } catch (err) {
        console.error('Error fetching EAL images:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchImages();
  }, []);

  const getImage = (key: string): EALImage | null => {
    return images[key] || null;
  };

  const getImageUrl = (key: string): string | null => {
    return images[key]?.image_url || null;
  };

  const getImageStyle = (key: string): React.CSSProperties => {
    const img = images[key];
    if (!img) return {};
    return {
      objectPosition: `${img.focal_x ?? 50}% ${img.focal_y ?? 50}%`,
    };
  };

  return { images, loading, getImage, getImageUrl, getImageStyle };
}
