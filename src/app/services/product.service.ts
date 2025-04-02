import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of, map, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product as AppProduct } from '../interfaces/product.interface';

// Define the API Product interface based on backend structure
export interface Product {
  id: string;
  name: string;
  description?: string;
  price?: number;
  features?: string[];
  includes?: { quantity: number; item: string }[];
  isNew?: boolean;
  image?: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
  pattern?: string;
  class?: string;
  category?: string;
}

// Re-export the app's Product interface for clarity
export { AppProduct };

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  // Get all products
  getProducts(): Observable<Product[]> {
    console.log('ProductService: Getting all products from', this.apiUrl);

    return this.http.get<Product[]>(this.apiUrl).pipe(
      tap((response) => console.log('Products response:', response)),
      catchError((error) => {
        console.error('Error fetching products:', error);
        return of([]);
      }),
    );
  }

  // Get a specific product by ID
  getProductById(id: string): Observable<Product | undefined> {
    console.log(
      `ProductService: Getting product ${id} from ${this.apiUrl}/${id}`,
    );

    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      tap((response) => console.log(`Product ${id} response:`, response)),
      catchError((error) => {
        console.error(`Error fetching product ${id}:`, error);
        return of(undefined);
      }),
    );
  }

  // Get a specific product by ID mapped to the app's Product interface
  getProductByIdAsAppProduct(id: string): Observable<AppProduct | undefined> {
    return this.getProductById(id).pipe(
      map((product) => {
        if (!product) return undefined;

        return this.mapToAppProduct(product);
      }),
    );
  }

  // Search products with query parameters
  searchProducts(
    query: string,
    filters?: Record<string, any>,
  ): Observable<Product[]> {
    console.log(`ProductService: Searching products with query '${query}'`);

    let params = new HttpParams().set('q', query);

    if (filters) {
      Object.keys(filters).forEach((key) => {
        if (filters[key] !== undefined && filters[key] !== null) {
          params = params.set(key, filters[key]);
        }
      });
    }

    return this.http.get<Product[]>(`${this.apiUrl}/search`, { params }).pipe(
      tap((response) => console.log('Search response:', response)),
      catchError((error) => {
        console.error('Error searching products:', error);
        return of([]);
      }),
    );
  }

  // Get popular products
  getPopularProducts(): Observable<Product[]> {
    console.log('ProductService: Getting popular products');

    return this.http.get<Product[]>(`${this.apiUrl}/popular`).pipe(
      tap((response) => console.log('Popular products response:', response)),
      catchError((error) => {
        console.error('Error fetching popular products:', error);
        return of([]);
      }),
    );
  }

  // Get products by category
  getProductsByCategory(category: string): Observable<Product[]> {
    // Ensure the category name is lowercase to match server expectations
    const normalizedCategory = category.toLowerCase();
    console.log(
      `ProductService: Getting products in category '${normalizedCategory}'`,
    );

    // Use the correct URL structure to match your server routes
    return this.http
      .get<Product[]>(`${this.apiUrl}/category/${normalizedCategory}`)
      .pipe(
        tap((response) =>
          console.log(
            `Products in category '${normalizedCategory}' response:`,
            response,
          ),
        ),
        catchError((error) => {
          console.error(
            `Error fetching products in category ${normalizedCategory}:`,
            error,
          );
          return of([]);
        }),
      );
  }

  // Create a new product (protected route - requires auth)
  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product).pipe(
      catchError((error) => {
        console.error('Error creating product:', error);
        throw error;
      }),
    );
  }

  // Update an existing product (protected route - requires auth)
  updateProduct(id: string, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product).pipe(
      catchError((error) => {
        console.error(`Error updating product ${id}:`, error);
        throw error;
      }),
    );
  }

  // Delete a product (protected route - requires auth)
  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error(`Error deleting product ${id}:`, error);
        throw error;
      }),
    );
  }

  // Method for handling image uploads to S3
  uploadProductImage(
    id: string,
    imageFile: File,
  ): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('image', imageFile);

    return this.http
      .post<{ imageUrl: string }>(`${this.apiUrl}/${id}/upload-image`, formData)
      .pipe(
        catchError((error) => {
          console.error(`Error uploading image for product ${id}:`, error);
          throw error;
        }),
      );
  }

  // Map API Product to App Product
  mapToAppProduct(product: Product): AppProduct {
    return {
      id: product.id,
      name: product.name,
      description: product.description || '',
      price: product.price || 0,
      category: product.category || '',
      isNew: product.isNew || false,
      features: product.features || [],
      includes: product.includes || [],
      images: product.image || {
        mobile: '',
        tablet: '',
        desktop: '',
      },
    };
  }
}
