// confirmation.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../interfaces/cart.interface';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
})
export class ConfirmationComponent implements OnInit {
  items: CartItem[] = [];
  firstItem: CartItem | null = null;
  remainingItems: number = 0;
  grandTotal: number = 0;

  constructor(private router: Router, private cartService: CartService) {}

  ngOnInit(): void {
    // Get cart state and set up display data
    this.cartService.getCartState().subscribe((state) => {
      this.items = state.items;
      this.firstItem = this.items[0] || null;
      this.remainingItems = Math.max(0, this.items.length - 1);
      this.grandTotal = this.calculateTotal();
    });
  }

  private calculateTotal(): number {
    const subtotal = this.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shipping = 50;
    const vat = subtotal * 0.2;
    return subtotal + shipping + vat;
  }

  backToHome(): void {
    this.cartService.removeAll();
    this.router.navigate(['/']);
  }
}
