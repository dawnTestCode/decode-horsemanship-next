export interface Horse {
  id: string;
  name: string;
  age: number;
  breed: string;
  gender: string;
  height: string;
  price: string;
  temperament: string;
  experience_level: string;
  training_status: string;
  story: string;
  photos: string[];
  videos: string[];
  status: 'available' | 'pending' | 'sold' | 'not_for_sale';
  show_in_listing: boolean;
  featured: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  media_type: 'photo' | 'video';
  media_url: string;
  sort_order: number;
  show_in_gallery: boolean;
}
