import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { CategoryItemComponent } from './category-item/category-item.component';
import { Category } from '../../interfaces/category.interface';
import { Subject, takeUntil, switchMap, of, forkJoin, catchError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, CategoryItemComponent, RouterModule],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit, OnDestroy {
  category?: Category;
  products: any[] = [];
  loading = false;
  error = '';
  debugInfo: any = {}; // For debug information
  environment = environment; // Expose environment to template
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private productService: ProductService,
  ) {}

  ngOnInit(): void {
    console.log('CategoryComponent initialized');

    // Subscribe to route parameter changes
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      console.log('Route params:', params);

      if (params['category']) {
        const categoryName = params['category'].toLowerCase();
        console.log('Loading category:', categoryName);
        this.debugInfo.categoryParam = categoryName;
        this.loadCategory(categoryName);
      } else {
        console.error('No category parameter found in route');
        this.error = 'Category parameter is missing';
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCategory(categoryName: string): void {
    this.loading = true;
    this.error = '';
    this.debugInfo = { categoryName };

    console.log(`Loading products for category: ${categoryName}`);

    // Get products directly from the ProductService
    this.productService
      .getProductsByCategory(categoryName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (products) => {
          console.log(
            `Received ${products.length} products for category ${categoryName}:`,
            products,
          );
          this.debugInfo.products = products;

          if (products && products.length > 0) {
            // Create a synthetic category if we got products
            this.category = {
              name: this.formatCategoryName(categoryName),
              items: products.map((product) => ({
                id: product.id,
                name: product.name,
                description: product.description || '',
                price: product.price || 0,
                isNew: product.isNew || false,
                images: product.image || {
                  mobile: '',
                  tablet: '',
                  desktop: '',
                },
              })),
            };

            // Log the items to check for duplicate IDs
            if (this.category.items) {
              const itemIds = this.category.items.map((item) => item.id);
              const uniqueIds = new Set(itemIds);

              if (itemIds.length !== uniqueIds.size) {
                console.warn(
                  'Duplicate IDs detected in category items:',
                  itemIds.filter((id, index) => itemIds.indexOf(id) !== index),
                );
              }
            }

            this.products = products;
            this.loading = false;
          } else {
            // Try getting the category from CategoryService as fallback
            this.loadCategoryFallback(categoryName);
          }
        },
        error: (err) => {
          console.error(
            `Error loading products for category ${categoryName}:`,
            err,
          );
          this.debugInfo.productsError = err;

          // Try getting the category from CategoryService as fallback
          this.loadCategoryFallback(categoryName);
        },
      });
  }

  private loadCategoryFallback(categoryName: string): void {
    console.log(
      `Trying to load category ${categoryName} from CategoryService as fallback`,
    );

    this.categoryService
      .getCategoryByName(categoryName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (category) => {
          console.log(
            `CategoryService returned category ${categoryName}:`,
            category,
          );
          this.debugInfo.categoryServiceResult = category;

          if (category) {
            this.category = category;
            this.loading = false;
          } else {
            this.loading = false;
            this.error = `Could not find category '${categoryName}'`;
          }
        },
        error: (err) => {
          console.error(
            `Error in fallback loading category ${categoryName}:`,
            err,
          );
          this.debugInfo.categoryServiceError = err;
          this.loading = false;
          this.error = `Failed to load category '${categoryName}'`;
        },
      });
  }

  // Helper to format category name for display (e.g., 'headphones' -> 'Headphones')
  private formatCategoryName(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  // Updated tracking function that creates a truly unique identifier
  trackByIdAndIndex(index: number, item: any): string {
    return `${item.id}_${index}`;
  }
}
