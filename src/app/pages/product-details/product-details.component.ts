import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { MenuComponent } from '@app/components/menu/menu.component';
import { PopularProductsComponent } from '@app/components/popular-products/popular-products.component';
import { Product } from '@app/interfaces/product.interface';
import { CategoryService } from '../../services/category.service';
import { filter, Subscription } from 'rxjs';
import { CartService } from '@app/services/cart.service';

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
  private routeSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private cartService: CartService
  ) {
    // Subscribe to route changes while on the same component
    this.routeSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const productId = this.route.snapshot.params['id'];
        this.findProduct(productId);
      });
  }

  ngOnInit(): void {
    const productId = this.route.snapshot.params['id'];
    this.findProduct(productId);
  }

  ngOnDestroy(): void {
    // Clean up subscription to prevent memory leaks
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  private findProduct(productId: string): void {
    const categories = this.categoryService.getCategories();
    for (const category of categories) {
      const product = category.items.find((item) => item.id === productId);

      if (product) {
        this.product = {
          ...product,
          category: category.name.toLocaleLowerCase(),
          price: product.price || 0,
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

  addToCart(): void {
    if (this.product && this.quantity > 0) {
      this.cartService.addToCart(
        this.product.id,
        this.product.category,
        this.product.name,
        this.product.price,
        this.quantity,
        this.product.images.mobile
      );
      this.quantity = 1;
      //-- Optionally show the cart after adding --//
      // this.cartService.toggleCart();
    }
  }

  goBack(): void {
    window.history.back();
  }
}
