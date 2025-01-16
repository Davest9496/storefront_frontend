import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../interfaces/cart.interface';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-summary.component.html',
  styleUrls: ['./cart-summary.component.scss'],
})
export class SummaryComponent {
  @Input() checkoutForm!: FormGroup;
  @Input() formStatusChange!: boolean;

  constructor(private cartService: CartService) {}

  readonly shippingRate = 0.05;
  readonly vatRate = 0.2;

  // Get items directly from cart service
  get items(): CartItem[] {
    return this.cartService.getCurrentItems();
  }

  get subtotal(): number {
    return this.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  get shippingCost(): number {
    return this.subtotal * this.shippingRate;
  }

  get vat(): number {
    return parseFloat((this.subtotal * this.vatRate).toFixed(2));
  }

  get grandTotal(): number {
    return this.subtotal + this.shippingCost + this.vat;
  }

  handleCheckout(): void {
    // Handle routing here
    // This will be triggered when the checkout form is submitted
    console.log('Processing checkout:', {
      items: this.items,
      subtotal: this.subtotal,
      shipping: this.shippingCost,
      vat: this.vat,
      total: this.grandTotal,
    });
  }
}
