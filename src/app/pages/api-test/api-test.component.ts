import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-api-test',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container p-4 mx-auto max-w-4xl">
      <h1 class="text-2xl font-bold mb-4">API Connection Test</h1>

      <div class="flex gap-2 mb-4">
        <button
          (click)="testProducts()"
          class="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Test Products
        </button>
        <button
          (click)="testCategories()"
          class="px-4 py-2 bg-green-500 text-white rounded"
        >
          Test Categories
        </button>
        <button
          (click)="testProductByCategory(categoryInput)"
          class="px-4 py-2 bg-purple-500 text-white rounded"
        >
          Test By Category
        </button>
        <input
          [(ngModel)]="categoryInput"
          placeholder="Category name"
          class="border px-2 py-1 rounded"
        />
      </div>

      <div class="mb-4">
        <button
          (click)="testProductById(productIdInput)"
          class="px-4 py-2 bg-orange-500 text-white rounded"
        >
          Get Product
        </button>
        <input
          [(ngModel)]="productIdInput"
          placeholder="Product ID"
          class="border px-2 py-1 rounded ml-2"
        />
      </div>

      <div
        *ngIf="loading"
        class="my-3 p-4 border border-blue-300 bg-blue-50 rounded"
      >
        <p>Testing API connection...</p>
      </div>

      <div
        *ngIf="error"
        class="my-3 p-4 border border-red-300 bg-red-50 rounded"
      >
        <h3 class="font-bold text-red-700">Error:</h3>
        <pre class="mt-2 p-2 bg-red-100 overflow-auto text-sm">{{
          error | json
        }}</pre>
      </div>

      <div *ngIf="apiResponse && !loading" class="my-3">
        <div class="p-4 border border-green-300 bg-green-50 rounded">
          <h3 class="font-bold text-green-700">Success!</h3>
          <p>API connection is working</p>
        </div>

        <div class="mt-4">
          <h4 class="font-bold">Received {{ apiResponseCount }} items</h4>
          <div class="flex justify-between mt-2 mb-2">
            <h4 class="font-bold">Response:</h4>
            <button
              (click)="toggleMappedResponse()"
              class="px-2 py-1 bg-gray-200 text-gray-800 rounded text-sm"
            >
              {{
                showMappedResponse
                  ? 'Show Raw Response'
                  : 'Show Mapped Response'
              }}
            </button>
          </div>
          <pre
            class="mt-2 p-4 bg-gray-100 rounded overflow-auto text-sm max-h-96"
            >{{ currentResponse | json }}</pre
          >
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class ApiTestComponent implements OnInit {
  apiResponse: any = null;
  mappedResponse: any = null;
  showMappedResponse = false;
  loading = false;
  error: any = null;
  categoryInput = 'headphones';
  productIdInput = 'xx99-mark-two';
  apiResponseCount = 0;

  constructor(
    private http: HttpClient,
    private productService: ProductService,
    private categoryService: CategoryService,
  ) {}

  ngOnInit(): void {
    // Auto-test on component init
    this.testProducts();
  }

  get currentResponse() {
    return this.showMappedResponse ? this.mappedResponse : this.apiResponse;
  }

  toggleMappedResponse(): void {
    this.showMappedResponse = !this.showMappedResponse;
  }

  testProducts(): void {
    this.loading = true;
    this.error = null;
    this.apiResponse = null;
    this.mappedResponse = null;

    // First get the raw response
    this.http.get(`${environment.apiUrl}/products`).subscribe({
      next: (response: any) => {
        this.apiResponse = response;
        this.apiResponseCount = Array.isArray(response) ? response.length : 0;
        console.log('Raw API response:', response);

        // Then get the mapped response
        this.productService.getProducts().subscribe({
          next: (mappedProducts) => {
            this.mappedResponse = mappedProducts;
            this.loading = false;
            console.log('Mapped products:', mappedProducts);
          },
          error: (err) => {
            console.error('Error mapping products:', err);
          },
        });
      },
      error: (err) => {
        this.error = err;
        this.loading = false;
        console.error('API error:', err);
      },
    });
  }

  testCategories(): void {
    this.loading = true;
    this.error = null;
    this.apiResponse = null;
    this.mappedResponse = null;

    this.http.get(`${environment.apiUrl}/categories`).subscribe({
      next: (response) => {
        this.apiResponse = response;
        this.apiResponseCount = Array.isArray(response)
          ? response.length
          : response &&
              'categories' in response &&
              Array.isArray(response.categories)
            ? response.categories.length
            : 0;

        this.loading = false;
        console.log('API response:', response);

        // We're not mapping categories in this example
        this.mappedResponse = response;
      },
      error: (err) => {
        this.error = err;
        this.loading = false;
        console.error('API error:', err);
      },
    });
  }

  testProductByCategory(category: string): void {
    if (!category) {
      this.error = 'Please enter a category name';
      return;
    }

    this.loading = true;
    this.error = null;
    this.apiResponse = null;
    this.mappedResponse = null;

    // Get raw response
    this.http
      .get(`${environment.apiUrl}/products/category/${category}`)
      .subscribe({
        next: (response: any) => {
          this.apiResponse = response;
          this.apiResponseCount = Array.isArray(response) ? response.length : 0;
          console.log('Raw products by category response:', response);

          // Get mapped response
          this.productService.getProductsByCategory(category).subscribe({
            next: (mappedProducts) => {
              this.mappedResponse = mappedProducts;
              this.loading = false;
              console.log('Mapped products by category:', mappedProducts);
            },
          });
        },
        error: (err) => {
          this.error = err;
          this.loading = false;
          console.error('API error:', err);
        },
      });
  }

  testProductById(id: string): void {
    if (!id) {
      this.error = 'Please enter a product ID';
      return;
    }

    this.loading = true;
    this.error = null;
    this.apiResponse = null;
    this.mappedResponse = null;

    // Get raw response
    this.http.get(`${environment.apiUrl}/products/${id}`).subscribe({
      next: (response) => {
        this.apiResponse = response;
        this.apiResponseCount = 1;
        console.log('Raw product response:', response);

        // Get mapped response
        this.productService.getProductByIdAsAppProduct(id).subscribe({
          next: (mappedProduct) => {
            this.mappedResponse = mappedProduct;
            this.loading = false;
            console.log('Mapped product:', mappedProduct);
          },
        });
      },
      error: (err) => {
        this.error = err;
        this.loading = false;
        console.error('API error:', err);
      },
    });
  }
}
