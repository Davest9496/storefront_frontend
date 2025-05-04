import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: string;
  total: number;
  items: number;
}

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="order-history-page">
      <div class="order-history-container">
        <h1 class="page-title">ORDER HISTORY</h1>

        <div *ngIf="loading" class="loading-message">
          <p>Loading your orders...</p>
        </div>

        <div *ngIf="error" class="error-message api-error">
          {{ error }}
        </div>

        <div *ngIf="!loading && !error">
          <div *ngIf="orders.length === 0" class="no-orders-message">
            <p>You haven't placed any orders yet.</p>
            <a routerLink="/" class="shop-link">Start Shopping</a>
          </div>

          <div *ngIf="orders.length > 0" class="orders-list">
            <div class="order-header">
              <div class="order-col">Order #</div>
              <div class="order-col">Date</div>
              <div class="order-col">Status</div>
              <div class="order-col">Total</div>
              <div class="order-col">Items</div>
              <div class="order-col action-col"></div>
            </div>

            <div *ngFor="let order of orders" class="order-row">
              <div class="order-col">{{ order.orderNumber }}</div>
              <div class="order-col">{{ order.date | date: 'mediumDate' }}</div>
              <div class="order-col status-col">
                <span class="status-badge" [class]="order.status.toLowerCase()">
                  {{ order.status }}
                </span>
              </div>
              <div class="order-col">€{{ order.total | number: '1.2-2' }}</div>
              <div class="order-col">{{ order.items }}</div>
              <div class="order-col action-col">
                <a
                  [routerLink]="['/account/orders', order.id]"
                  class="view-btn"
                >
                  View
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./order-history.component.scss'],
})
export class OrderHistoryComponent implements OnInit {
  orders: Order[] = [];
  loading = true;
  error = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    this.error = '';

    this.http.get<any>(`${environment.apiUrl}/orders`).subscribe({
      next: (response) => {
        this.orders = response.data.orders;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.error =
          error.error?.message ||
          'Failed to load your orders. Please try again.';
      },
    });
  }
}
