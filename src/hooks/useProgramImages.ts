import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface ProgramImage {
  id: string;
  image_key: string;
  title: string;
  description: string | null;
  image_url: string | null;
  focal_x: number;
  focal_y: number;
  is_visible: boolean;
}

interface UseProgramImagesResult {
  images: Record<string, ProgramImage>;
  loading: boolean;
  getImage: (key: string) => ProgramImage | null;
  getImageUrl: (key: string) => string | null;
  getImageStyle: (key: string) => React.CSSProperties;
}

export function useProgramImages(): UseProgramImagesResult {
  const [images, setImages] = useState<Record<string, ProgramImage>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchImages() {
      try {
        // Table is still named eal_images in database
        const { data, error } = await supabase
          .from('eal_images')
          .select('*')
          .eq('is_visible', true);

        if (error) throw error;

        const imageMap: Record<string, ProgramImage> = {};
        data?.forEach((img) => {
          imageMap[img.image_key] = img;
        });
        setImages(imageMap);
      } catch (err) {
        console.error('Error fetching program images:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchImages();
  }, []);

  const getImage = (key: string): ProgramImage | null => {
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
