export interface CategoryItem {
  id: string;
  name: string;
  description: string;
  price: number;
  isNew: boolean;
  images: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
}

export interface Category {
  name: string;
  items: CategoryItem[];
}
