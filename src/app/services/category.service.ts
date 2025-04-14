import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of, tap } from 'rxjs';
import { Category, CategoryItem } from '../interfaces/category.interface';
import { environment } from '../../environments/environment';
import { ProductService, ApiResponse, ApiProduct } from './product.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  // Set up the API URL
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(
    private http: HttpClient,
    private productService: ProductService,
  ) {
    console.log('CategoryService initialized with API URL:', this.apiUrl);
  }

  // Get all categories by collecting unique categories from products
  getCategories(): Observable<Category[]> {
    console.log('CategoryService: Getting categories from products');

    return this.http.get<ApiResponse>(this.apiUrl).pipe(
      tap((response) => console.log('Raw categories response:', response)),
      map((response) => {
        if (
          response.status === 'success' &&
          response.data &&
          Array.isArray(response.data.products)
        ) {
          // Extract unique categories
          const categoriesMap = new Map<string, Category>();

          response.data.products.forEach((product) => {
            if (
              product.category &&
              !categoriesMap.has(product.category.toLowerCase())
            ) {
              categoriesMap.set(product.category.toLowerCase(), {
                name: this.formatCategoryName(product.category),
                items: [],
              });
            }
          });

          // Convert map to array
          return Array.from(categoriesMap.values());
        }
        return [];
      }),
      tap((categories) => console.log('Generated categories:', categories)),
      catchError((error) => {
        console.error('Error generating categories:', error);
        return of([]);
      }),
    );
  }

  // Get a category by name by getting products in that category
  getCategoryByName(name: string): Observable<Category | undefined> {
    console.log(`CategoryService: Getting category ${name} by its products`);
    const normalizedName = name.toLowerCase();

    return this.http
      .get<ApiResponse>(`${this.apiUrl}/category/${normalizedName}`)
      .pipe(
        tap((response) =>
          console.log(`Raw category ${name} response:`, response),
        ),
        map((response) => {
          if (
            response.status === 'success' &&
            response.data &&
            Array.isArray(response.data.products)
          ) {
            if (response.data.products.length === 0) {
              return undefined;
            }

            // Create a category with the products as items
            return {
              name: this.formatCategoryName(normalizedName),
              items: response.data.products.map((product) =>
                this.mapApiProductToCategoryItem(product),
              ),
            };
          }
          return undefined;
        }),
        tap((category) => console.log(`Generated category ${name}:`, category)),
        catchError((error) => {
          console.error(`Error generating category ${name}:`, error);
          return of(undefined);
        }),
      );
  }

  // Map API Product to Category Item
  private mapApiProductToCategoryItem(product: ApiProduct): CategoryItem {
    // Generate image paths based on the imageName and category
    const imageName =
      product.imageName || `product-${product.id}-${product.category}`;

    return {
      id: product.id,
      name: product.productName,
      description: product.productDesc || '',
      price:
        typeof product.price === 'string'
          ? parseFloat(product.price || '0')
          : product.price || 0,
      isNew: product.isNew || false,
      images: {
        mobile: `${imageName}/mobile/image-product.jpg`,
        tablet: `${imageName}/tablet/image-product.jpg`,
        desktop: `${imageName}/desktop/image-product.jpg`,
      },
    };
  }

  // Helper to format category name properly
  private formatCategoryName(name: string): string {
    if (!name) return '';
    const lowerName = name.toLowerCase();
    return lowerName.charAt(0).toUpperCase() + lowerName.slice(1);
  }
}
