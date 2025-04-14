import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { MenuComponent } from '@app/components/menu/menu.component';
import { PopularProductsComponent } from '@app/components/popular-products/popular-products.component';
import { Product } from '@app/interfaces/product.interface';
import { CategoryService } from '../../services/category.service';
import { ProductService, AppProduct } from '../../services/product.service';
import { AssetService } from '../../services/asset.service';
import { filter, Subscription, switchMap, tap, of } from 'rxjs';
import { CartService } from '@app/services/cart.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, MenuComponent, PopularProductsComponent],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  product?: Product;
  quantity: number = 1;
  loading = false;
  error = '';
  debugInfo: any = {}; // For debug information

  // Use the existing SVG file
  placeholderImagePath = '/assets/placeholder-image.svg';

  // Image URLs
  mobileSrc = this.placeholderImagePath;
  tabletSrc = this.placeholderImagePath;
  desktopSrc = this.placeholderImagePath;

  private routeSubscription?: Subscription;
  private productSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private productService: ProductService,
    private cartService: CartService,
    private assetService: AssetService,
  ) {
    // Subscribe to route changes while on the same component
    this.routeSubscription = this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        tap(() => {
          const productId = this.route.snapshot.params['id'];
          this.loadProduct(productId);
        }),
      )
      .subscribe();
  }

  ngOnInit(): void {
    const productId = this.route.snapshot.params['id'];
    console.log(
      'ProductDetailsComponent initialized with productId:',
      productId,
    );
    this.loadProduct(productId);
  }

  ngOnDestroy(): void {
    // Clean up subscriptions to prevent memory leaks
    this.routeSubscription?.unsubscribe();
    this.productSubscription?.unsubscribe();
  }

  private loadProduct(productId: string): void {
    this.loading = true;
    this.error = '';
    this.debugInfo = { productId };

    console.log(`Loading product details for ID: ${productId}`);

    // Use the ProductService's mapping method to get product by ID
    this.productSubscription = this.productService
      .getProductByIdAsAppProduct(productId)
      .subscribe({
        next: (product) => {
          console.log('Received product data:', product);
          this.debugInfo.product = product;

          if (product) {
            this.product = product;
            this.processProductImages();
            this.loading = false;
          } else {
            console.error('Product not found:', productId);
            this.error = `Product not found: ${productId}`;
            this.loading = false;
            // Navigate to not-found after a short delay to show the error
            setTimeout(() => {
              this.router.navigate(['/not-found']);
            }, 3000);
          }
        },
        error: (err) => {
          console.error('Error loading product:', err);
          this.debugInfo.error = err;
          this.error =
            'Failed to load product details. Please try again later.';
          this.loading = false;
        },
      });
  }

  // Process product images to get correct URLs
  private processProductImages(): void {
    console.log('Processing product images:', this.product?.images);

    if (this.product?.images) {
      if (this.product.images.mobile) {
        this.mobileSrc = this.assetService.getAssetUrl(
          this.product.images.mobile,
        );
        console.log('Mobile image URL:', this.mobileSrc);
      }

      if (this.product.images.tablet) {
        this.tabletSrc = this.assetService.getAssetUrl(
          this.product.images.tablet,
        );
        console.log('Tablet image URL:', this.tabletSrc);
      }

      if (this.product.images.desktop) {
        this.desktopSrc = this.assetService.getAssetUrl(
          this.product.images.desktop,
        );
        console.log('Desktop image URL:', this.desktopSrc);
      }
    } else {
      console.warn('No product images found');
    }
  }

  // Helper method to get the correct image URL
  getImageUrl(path: string): string {
    return this.assetService.getAssetUrl(path);
  }

  getImagePath(
    imageNumber: number,
    size: 'mobile' | 'tablet' | 'desktop',
  ): string {
    if (!this.product || !this.product.category)
      return this.placeholderImagePath;

    try {
      // Use imageName if available from the API response, or construct it
      const baseImageName =
        this.product.images?.desktop?.split('/')[0] ||
        `product-${this.product.id}-${this.product.category.toLowerCase()}`;

      const path = `${baseImageName}/${size}/image-gallery-${imageNumber}.jpg`;
      console.log(`Generated gallery image path: ${path}`);

      return this.assetService.getAssetUrl(path);
    } catch (err) {
      console.error('Error generating image path:', err);
      return this.placeholderImagePath;
    }
  }

  // Handle image error events safely
  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    if (imgElement && imgElement instanceof HTMLImageElement) {
      console.warn('Image failed to load:', imgElement.src);

      // Prevent infinite loop by checking if we're already using the placeholder
      if (imgElement.src !== this.placeholderImagePath) {
        imgElement.src = this.placeholderImagePath;
      }
    }
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
      // Use the asset service to get the correct image URL for the cart
      const imageSrc =
        this.product.images && this.product.images.mobile
          ? this.assetService.getAssetUrl(this.product.images.mobile)
          : this.placeholderImagePath;

      this.cartService.addToCart(
        this.product.id,
        this.product.category || '',
        this.product.name,
        this.product.price || 0,
        this.quantity,
        imageSrc,
      );
      this.quantity = 1;
    }
  }

  goBack(): void {
    window.history.back();
  }
}
