import { Injectable } from '@angular/core';
import { Category } from '../interfaces/category.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private categories: Category[] = [
    {
      name: 'Headphones',
      items: [
        {
          id: 'xx99-mark-two',
          name: 'XX99 Mark II Headphones',
          description:
            'The new XX99 Mark II headphones is the pinnacle of pristine audio. It redefines your premium headphone experience by reproducing the balanced depth and precision of studio-quality sound.',
          isNew: true,
          images: {
            mobile:
              'assets/product-xx99-mark-two-headphones/mobile/image-product.jpg',
            tablet:
              'assets/product-xx99-mark-two-headphones/tablet/image-product.jpg',
            desktop:
              'assets/product-xx99-mark-two-headphones/desktop/image-product.jpg',
          },
        },
        {
          id: 'xx99-mark-one',
          name: 'XX99 Mark I Headphones',
          description:
            'As the gold standard for headphones, the classic XX99 Mark I offers detailed and accurate audio reproduction for audiophiles, mixing engineers, and music aficionados alike in studios and on the go.',
          isNew: false,
          images: {
            mobile:
              'assets/product-xx99-mark-one-headphones/mobile/image-product.jpg',
            tablet:
              'assets/product-xx99-mark-one-headphones/tablet/image-product.jpg',
            desktop:
              'assets/product-xx99-mark-one-headphones/desktop/image-product.jpg',
          },
        },
        {
          id: 'xx59',
          name: 'XX59 Headphones',
          description:
            'Enjoy your audio almost anywhere and customize it to your specific tastes with the XX59 headphones. The stylish yet durable versatile wireless headset is a brilliant companion at home or on the move.',
          isNew: false,
          images: {
            mobile: 'assets/product-xx59-headphones/mobile/image-product.jpg',
            tablet: 'assets/product-xx59-headphones/tablet/image-product.jpg',
            desktop: 'assets/product-xx59-headphones/desktop/image-product.jpg',
          },
        },
      ],
    },
    {
      name: 'Speakers',
      items: [
        {
          id: 'zx9',
          name: 'ZX9 Speaker',
          description:
            'Upgrade your sound system with the all new ZX9 active speaker. It’s a bookshelf speaker system that offers truly wireless connectivity -- creating new possibilities for more pleasing and practical audio setups.',
          isNew: true,
          images: {
            mobile: 'assets/product-zx9-speaker/mobile/image-product.jpg',
            tablet: 'assets/product-zx9-speaker/tablet/image-product.jpg',
            desktop: 'assets/product-zx9-speaker/desktop/image-product.jpg',
          },
        },
        {
          id: 'zx7',
          name: 'ZX7 Speaker',
          description:
            'Stream high quality sound wirelessly with minimal loss. The ZX7 bookshelf speaker uses high-end audiophile components that represents the top of the line powered speakers for home or studio use.',
          isNew: false,
          images: {
            mobile: 'assets/product-zx7-speaker/mobile/image-product.jpg',
            tablet: 'assets/product-zx7-speaker/tablet/image-product.jpg',
            desktop: 'assets/product-zx7-speaker/desktop/image-product.jpg',
          },
        },
      ],
    },
    {
      name: 'Earphones',
      items: [
        {
          id: 'yx1',
          name: 'YX1 Wireless Earphones',
          description:
            'Tailor your listening experience with bespoke dynamic drivers from the new YX1 Wireless Earphones. Enjoy incredible high-fidelity sound even in noisy environments with its active noise cancellation feature.',
          isNew: true,
          images: {
            mobile: 'assets/product-yx1-earphones/mobile/image-product.jpg',
            tablet: 'assets/product-yx1-earphones/tablet/image-product.jpg',
            desktop: 'assets/product-yx1-earphones/desktop/image-product.jpg',
          },
        },
      ],
    },
  ];

  getCategories(): Category[] {
    return this.categories;
  }

  getCategoryByName(name: string): Category | undefined {
    return this.categories.find(
      (category) => category.name.toLowerCase() === name.toLowerCase()
    );
  }
}
