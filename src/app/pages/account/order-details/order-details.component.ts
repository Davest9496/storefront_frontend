import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: string;
  total: number;
  subtotal: number;
  shipping: number;
  vat: number;
  items: OrderItem[];
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    postcode: string;
    country: string;
  };
  paymentMethod: string;
}

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="order-details-page">
      <div class="order-details-container">
        <div class="go-back">
          <button class="back-btn" (click)="goBack()">
            &larr; Back to Orders
          </button>
        </div>

        <h1 class="page-title">ORDER #{{ order?.orderNumber || '' }}</h1>

        <div *ngIf="loading" class="loading-message">
          <p>Loading order details...</p>
        </div>

        <div *ngIf="error" class="error-message api-error">
          {{ error }}
        </div>

        <div *ngIf="!loading && !error && order" class="order-details">
          <div class="order-status">
            <span class="status-badge" [class]="order.status.toLowerCase()">
              {{ order.status }}
            </span>
            <div class="order-date">
              Order placed on {{ order.date | date: 'fullDate' }}
            </div>
          </div>

          <div class="order-summary">
            <div class="order-items">
              <h2>Order Items</h2>
              <div *ngFor="let item of order.items" class="order-item">
                <div class="item-image">
                  <img [src]="item.image" [alt]="item.name" />
                </div>
                <div class="item-details">
                  <h3>{{ item.name }}</h3>
                  <p class="item-price">€{{ item.price | number: '1.2-2' }}</p>
                </div>
                <div class="item-quantity">x{{ item.quantity }}</div>
              </div>
            </div>

            <div class="order-info">
              <div class="order-totals">
                <h2>Summary</h2>
                <div class="total-row">
                  <span>Subtotal</span>
                  <span>€{{ order.subtotal | number: '1.2-2' }}</span>
                </div>
                <div class="total-row">
                  <span>Shipping</span>
                  <span>€{{ order.shipping | number: '1.2-2' }}</span>
                </div>
                <div class="total-row">
                  <span>VAT (20%)</span>
                  <span>€{{ order.vat | number: '1.2-2' }}</span>
                </div>
                <div class="total-row grand-total">
                  <span>GRAND TOTAL</span>
                  <span>€{{ order.total | number: '1.2-2' }}</span>
                </div>
              </div>

              <div class="shipping-info">
                <h2>Shipping Info</h2>
                <p>
                  <strong>{{ order.shippingAddress.name }}</strong>
                </p>
                <p>{{ order.shippingAddress.address }}</p>
                <p>
                  {{ order.shippingAddress.city }},
                  {{ order.shippingAddress.postcode }}
                </p>
                <p>{{ order.shippingAddress.country }}</p>
              </div>

              <div class="payment-info">
                <h2>Payment Method</h2>
                <p>{{ order.paymentMethod }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./order-details.component.scss'],
})
export class OrderDetailsComponent implements OnInit {
  orderId = '';
  order: Order | null = null;
  loading = true;
  error = '';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.orderId = params['id'];
      this.loadOrderDetails();
    });
  }

  loadOrderDetails() {
    this.loading = true;
    this.error = '';

    this.http
      .get<any>(`${environment.apiUrl}/orders/${this.orderId}`)
      .subscribe({
        next: (response) => {
          this.order = response.data.order;
          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
          this.error =
            error.error?.message ||
            'Failed to load order details. Please try again.';
        },
      });
  }

  goBack() {
    this.router.navigate(['/account/orders']);
  }
}
