export interface Category {
  name: string;
  items?: CategoryItem[];
}

export interface CategoryItem {
  id: string;
  name: string;
  description: string;
  price: number;
  features?: string[];
  includes?: { quantity: number; item: string }[];
  isNew?: boolean;
  images?: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
}
