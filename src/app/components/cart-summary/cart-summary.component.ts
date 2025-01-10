// summary.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-summary.component.html',
  styleUrls: ['./cart-summary.component.scss'],
})
export class SummaryComponent {
  @Input() items: CartItem[] = [];

  // Shipping cost is 5% of subtotal for development purpose
  readonly shippingRate = 0.05;
  // VAT rate is 20%
  readonly vatRate = 0.2;

  // Calculate shipping cost
  get shippingCost(): number {
    return this.subtotal * this.shippingRate
  }

  // Calculate total before VAT and shipping
  get subtotal(): number {
    return this.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  // Calculate VAT amount
  get vat(): number {
    return this.subtotal * this.vatRate;
  }

  // Calculate grand total
  get grandTotal(): number {
    return this.subtotal + this.shippingCost + this.vat;
  }
}
