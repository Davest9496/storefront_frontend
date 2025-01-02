
export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  isNew: boolean;
  features: string;
  includes: BoxItem[];
  gallery: Gallery;
  images: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
}

export interface BoxItem {
  quantity: number;
  item: string;
}

export interface Gallery {
  first: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
  second: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
  third: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
}
