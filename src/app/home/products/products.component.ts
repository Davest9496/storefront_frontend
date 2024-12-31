import { Component } from '@angular/core';
import { ButtonComponent } from '../../button/button.component';

@Component({
  selector: 'app-products',
  imports: [ButtonComponent],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent {
  products = [
    {
      name: 'ZX9 SPEAKER',
      description:
        'Upgrade to premium speakers that are phenomenally built to deliver truly remarkable sound.',
      image: {
        mobile: 'assets/home/mobile/image-speaker-zx9.png',
        tablet: 'assets/home/tablet/image-speaker-zx9.png',
        desktop: 'assets/home/desktop/image-speaker-zx9.png',
      },
      pattern: 'assets/home/desktop/pattern-circles.svg',
      class: 'product_featured',
    },
    {
      name: 'ZX7 SPEAKER',
      image: {
        mobile: 'assets/home/mobile/image-speaker-zx7.jpg',
        tablet: 'assets/home/tablet/image-speaker-zx7.jpg',
        desktop: 'assets/home/desktop/image-speaker-zx7.jpg',
      },
      class: 'product_secondary',
    },
    {
      name: 'YX1 EARPHONES',
      image: {
        mobile: 'assets/home/mobile/image-earphones-yx1.jpg',
        tablet: 'assets/home/tablet/image-earphones-yx1.jpg',
        desktop: 'assets/home/desktop/image-earphones-yx1.jpg',
      },
      class: 'product_tertiary',
    },
  ];
}
