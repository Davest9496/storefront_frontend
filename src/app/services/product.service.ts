import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of, map, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product as AppProduct } from '../interfaces/product.interface';
import { AssetService } from './asset.service';

// Define the API Product interface based on the actual JSON response structure
export interface ApiProduct {
  id: string;
  productName: string;
  productDesc?: string;
  price?: string;
  category?: string;
  imageName?: string;
  productFeatures?: string[];
  productAccessories?: string[];
  isNew?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Define the API response wrapper structure
export interface ApiResponse {
  status: string;
  results?: number;
  data: {
    products: ApiProduct[];
  };
}

// Re-export the app's Product interface for clarity
export { AppProduct };

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(
    private http: HttpClient,
    private assetService: AssetService,
  ) {
    console.log('ProductService initialized with API URL:', this.apiUrl);
  }

  // Get all products
  getProducts(): Observable<AppProduct[]> {
    console.log('ProductService: Getting all products from', this.apiUrl);

    return this.http.get<ApiResponse>(this.apiUrl).pipe(
      tap((response) => console.log('Raw products response:', response)),
      map((response) => {
        // Handle the nested response structure
        if (
          response.status === 'success' &&
          response.data &&
          Array.isArray(response.data.products)
        ) {
          return response.data.products.map((p) => this.mapToAppProduct(p));
        }
        return [];
      }),
      catchError((error) => {
        console.error('Error fetching products:', error);
        return of([]);
      }),
    );
  }

  // Get a specific product by ID
  getProductById(id: string): Observable<ApiProduct | undefined> {
    console.log(
      `ProductService: Getting product ${id} from ${this.apiUrl}/${id}`,
    );

    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      tap((response) => console.log(`Raw product ${id} response:`, response)),
      map((response) => {
        // Handle different response formats

        // Case 1: Direct product object with id field
        if (response && response.id === id) {
          console.log(`Product ${id} found in direct response`);
          return response;
        }

        // Case 2: Nested in data.products array
        if (response?.status === 'success' && response?.data?.products) {
          const products = response.data.products;
          if (Array.isArray(products) && products.length > 0) {
            const product = products.find((p) => p.id === id);
            if (product) {
              console.log(`Product ${id} found in data.products array`);
              return product;
            }
          }
        }

        // Case 3: Nested in data.product (single product) - THIS IS YOUR CASE
        if (
          response?.status === 'success' &&
          response?.data?.product &&
          response.data.product.id === id
        ) {
          console.log(`Product ${id} found in data.product object`);
          return response.data.product;
        }

        // Case 4: Nested in data object directly
        if (
          response?.status === 'success' &&
          response?.data &&
          response.data.id === id
        ) {
          console.log(`Product ${id} found in data object`);
          return response.data;
        }

        console.warn(`Product ${id} not found in response`);
        return undefined;
      }),
      catchError((error) => {
        console.error(`Error fetching product ${id}:`, error);
        return of(undefined);
      }),
    );
  }

  // Get a specific product by ID mapped to the app's Product interface
  getProductByIdAsAppProduct(id: string): Observable<AppProduct | undefined> {
    return this.getProductById(id).pipe(
      tap((product) => console.log(`Product ${id} before mapping:`, product)),
      map((product) => {
        if (!product) {
          console.warn(`No product found for ID ${id}`);
          return undefined;
        }

        const mappedProduct = this.mapToAppProduct(product);
        console.log(`Product ${id} after mapping:`, mappedProduct);
        return mappedProduct;
      }),
    );
  }

  // Get featured products
  getFeaturedProducts(): Observable<AppProduct[]> {
    console.log('ProductService: Getting featured products');

    return this.http.get<ApiResponse>(`${this.apiUrl}/featured`).pipe(
      tap((response) =>
        console.log('Featured products raw response:', response),
      ),
      map((response) => {
        if (
          response.status === 'success' &&
          response.data &&
          Array.isArray(response.data.products)
        ) {
          return response.data.products.map((p) => this.mapToAppProduct(p));
        }
        return [];
      }),
      catchError((error) => {
        console.error('Error fetching featured products:', error);
        return of([]);
      }),
    );
  }

  // Get popular products (alias for featured if API doesn't have a separate popular endpoint)
  getPopularProducts(): Observable<AppProduct[]> {
    console.log(
      'ProductService: Getting popular products (using featured endpoint)',
    );
    return this.getFeaturedProducts();
  }

  // Get products by category
  getProductsByCategory(category: string): Observable<AppProduct[]> {
    // Ensure the category name is lowercase to match server expectations
    const normalizedCategory = category.toLowerCase();
    console.log(
      `ProductService: Getting products in category '${normalizedCategory}'`,
    );

    // Use the correct URL structure to match your server routes
    return this.http
      .get<ApiResponse>(`${this.apiUrl}/category/${normalizedCategory}`)
      .pipe(
        tap((response) =>
          console.log(
            `Products in category '${normalizedCategory}' raw response:`,
            response,
          ),
        ),
        map((response) => {
          if (
            response.status === 'success' &&
            response.data &&
            Array.isArray(response.data.products)
          ) {
            return response.data.products.map((p) => this.mapToAppProduct(p));
          }
          return [];
        }),
        catchError((error) => {
          console.error(
            `Error fetching products in category ${normalizedCategory}:`,
            error,
          );
          return of([]);
        }),
      );
  }

  // Map API Product to App Product
  mapToAppProduct(product: ApiProduct): AppProduct {
    // Try to parse accessory JSON strings if they exist
    const includes = product.productAccessories
      ? product.productAccessories.map((item) => {
          try {
            if (typeof item === 'string') {
              return JSON.parse(item);
            } else {
              return item;
            }
          } catch (e) {
            console.warn('Failed to parse accessory JSON:', item);
            return { quantity: 1, item: item };
          }
        })
      : [];

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
      category: product.category || '',
      isNew: product.isNew || false,
      features: product.productFeatures || [],
      includes: includes,
      images: {
        // Use AssetService to resolve image URLs
        mobile: this.assetService.getAssetUrl(
          `${imageName}/mobile/image-product.jpg`,
        ),
        tablet: this.assetService.getAssetUrl(
          `${imageName}/tablet/image-product.jpg`,
        ),
        desktop: this.assetService.getAssetUrl(
          `${imageName}/desktop/image-product.jpg`,
        ),
      },
    };
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
}
