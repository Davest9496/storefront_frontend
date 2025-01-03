import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuComponent } from '@app/components/menu/menu.component';
import { PopularProductsComponent } from '@app/components/popular-products/popular-products.component';
import { Product } from '@app/interfaces/product.interface';
import { CategoryService } from '../../services/category.services';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, MenuComponent, PopularProductsComponent],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit {
  product?: Product;
  quantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.params['id'];
    this.findProduct(productId);
  }

  private findProduct(productId: string): void {

    const categories = this.categoryService.getCategories();
    for (const category of categories) {
      const product = category.items.find((item) => item.id === productId);

      if (product) {
        this.product = {
          ...product,
          category: category.name.toLocaleLowerCase(),
          price: product.price || 0
        } as Product;

        return;
      }
    }
    // If product not found, navigate to not-found page
    this.router.navigate(['/not-found']);
  }

  // Get method to construct image paths
  getImagePath(
    imageNumber: number,
    size: 'mobile' | 'tablet' | 'desktop'
  ): string {
    if (!this.product) return '';
    return `/assets/product-${
      this.product.id
    }-${this.product.category.toLowerCase()}/${size}/image-gallery-${imageNumber}.jpg`;
  }

  incrementQuantity(): void {
    this.quantity++;
  }

  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  goBack(): void {
    window.history.back();
  }
}
