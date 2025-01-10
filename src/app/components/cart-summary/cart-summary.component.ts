// summary.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem } from '../../interfaces/cart.interface';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-summary.component.html',
  styleUrls: ['./cart-summary.component.scss'],
})
export class SummaryComponent {
  @Input() items: CartItem[] = [];
  @Output() checkout = new EventEmitter<void>();

  readonly shippingRate = 0.05;
  readonly vatRate = 0.2;

  get shippingCost(): number {
    return this.subtotal * this.shippingRate;
  }

  get subtotal(): number {
    return this.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  get vat(): number {
    return this.subtotal * this.vatRate;
  }

  get grandTotal(): number {
    return this.subtotal + this.shippingCost + this.vat;
  }

  handleCheckout(): void {
    this.checkout.emit();
  }
}
