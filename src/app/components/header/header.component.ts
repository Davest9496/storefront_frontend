import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '@app/services/cart.service';
import { CartComponent } from '../cart/cart.component';
import { CartState, CartItem } from '@app/interfaces/cart.interface';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, CartComponent],
})
export class HeaderComponent {
  isMenuOpen = false;
  constructor(public cartService: CartService) {}

  toggleCart(): void {
    this.cartService.toggleCart();
  }

  getItemCount(state: CartState): number {
    if (!state || !state.items) return 0;
    return state.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  // Helper method to check if cart has items
  hasItems(state: CartState): boolean {
    return state?.items?.length > 0;
  }

  // Helper method to close menu
  closeMenu(): void {
    if (this.isMenuOpen) {
      this.isMenuOpen = false;
      document.body.classList.remove('menu-active');
    }
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) {
      document.body.classList.add('menu-active');
    } else {
      document.body.classList.remove('menu-active');
    }
  }

  // Close menu on window resize (tablet and above)
  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth >= 992) {
      this.closeMenu();
    }
  }

  // Close menu when clicking outside
  @HostListener('window:click', ['$event'])
  onClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (
      this.isMenuOpen &&
      !target.closest('.header_menu-btn') &&
      !target.closest('.header_links')
    ) {
      this.closeMenu();
    }
  }
}
