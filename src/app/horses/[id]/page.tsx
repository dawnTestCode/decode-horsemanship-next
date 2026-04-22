import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import HorseDetailClient from './HorseDetailClient';

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

// Fetch horse data server-side
async function getHorse(id: string): Promise<Horse | null> {
  const { data, error } = await supabase
    .from('horses')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

// Generate dynamic metadata for social previews
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const horse = await getHorse(id);

  if (!horse) {
    return {
      title: 'Horse Not Found | Decode Horsemanship',
    };
  }

  const description = `${horse.name} is a ${horse.age} year old ${horse.gender} ${horse.breed}. ${horse.temperament} temperament, ${horse.training_status}, suitable for ${horse.experience_level} riders.`;
  const imageUrl = horse.photos?.[0] || 'https://decodehorsemanship.com/og-default.jpg';

  return {
    title: `${horse.name} | Decode Horsemanship`,
    description,
    openGraph: {
      title: `${horse.name} - ${horse.breed} | Decode Horsemanship`,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: horse.name,
        },
      ],
      type: 'website',
      siteName: 'Decode Horsemanship',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${horse.name} - ${horse.breed}`,
      description,
      images: [imageUrl],
    },
  };
}

// Server component that fetches data and passes to client component
export default async function HorseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const horse = await getHorse(id);

  if (!horse) {
    notFound();
  }

  return <HorseDetailClient horse={horse} />;
}
