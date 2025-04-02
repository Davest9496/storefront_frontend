import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-api-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container my-5">
      <h2>API Connection Test</h2>

      <div *ngIf="loading" class="my-3">
        <p>Testing API connection...</p>
      </div>

      <div *ngIf="error" class="my-3 text-danger">
        <h3>Error:</h3>
        <pre>{{ error | json }}</pre>
      </div>

      <div *ngIf="apiResponse && !loading" class="my-3">
        <h3>Success!</h3>
        <p>API connection is working</p>
        <h4>Response:</h4>
        <pre>{{ apiResponse | json }}</pre>
      </div>

      <button (click)="testProducts()" class="btn btn-primary mr-2">
        Test Products
      </button>
      <button (click)="testCategories()" class="btn btn-secondary mr-2">
        Test Categories
      </button>
      <button
        (click)="testProductByCategory('headphones')"
        class="btn btn-info"
      >
        Test Products by Category
      </button>
    </div>
  `,
  styles: [],
})
export class ApiTestComponent implements OnInit {
  apiResponse: any = null;
  loading = false;
  error: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Auto-test on component init
    this.testProducts();
  }

  testProducts(): void {
    this.loading = true;
    this.error = null;
    this.apiResponse = null;

    this.http.get(`${environment.apiUrl}/products`).subscribe({
      next: (response) => {
        this.apiResponse = response;
        this.loading = false;
        console.log('API response:', response);
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

    this.http.get(`${environment.apiUrl}/categories`).subscribe({
      next: (response) => {
        this.apiResponse = response;
        this.loading = false;
        console.log('API response:', response);
      },
      error: (err) => {
        this.error = err;
        this.loading = false;
        console.error('API error:', err);
      },
    });
  }

  testProductByCategory(category: string): void {
    this.loading = true;
    this.error = null;
    this.apiResponse = null;

    this.http
      .get(`${environment.apiUrl}/products/category/${category}`)
      .subscribe({
        next: (response) => {
          this.apiResponse = response;
          this.loading = false;
          console.log('Products by category response:', response);
        },
        error: (err) => {
          this.error = err;
          this.loading = false;
          console.error('API error:', err);
        },
      });
  }
}
