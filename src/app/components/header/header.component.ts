import { Component, HostListener, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '@app/services/cart.service';
import { CartComponent } from '../cart/cart.component';
import { CartState, CartItem } from '@app/interfaces/cart.interface';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, CartComponent],
})
export class HeaderComponent implements OnInit {
  isMenuOpen = false;
  isProfileDropdownOpen = false;
  hoverTimeout: any = null;
  isLoggedIn$!: Observable<boolean>;

  constructor(
    public cartService: CartService,
    public authService: AuthService,
  ) {}

  ngOnInit(): void {
    // Initialize the isLoggedIn$ observable
    this.isLoggedIn$ = this.authService.isLoggedIn();
  }

  toggleCart(): void {
    this.cartService.toggleCart();
  }

  // Toggle profile dropdown
  toggleProfileDropdown(event: Event): void {
    event.stopPropagation();
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
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

  // Handle hover events
  onProfileHover(isHovering: boolean): void {
    if (window.innerWidth >= 992) {
      // Only apply hover on tablet and above
      if (isHovering) {
        // Clear any existing timeout
        if (this.hoverTimeout) {
          clearTimeout(this.hoverTimeout);
          this.hoverTimeout = null;
        }
        this.isProfileDropdownOpen = true;
      } else {
        // Add small delay before closing
        this.hoverTimeout = setTimeout(() => {
          this.isProfileDropdownOpen = false;
        }, 200);
      }
    }
  }

  closeProfileDropdown(): void {
    this.isProfileDropdownOpen = false;
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }
  }

  // Logout function that also closes the dropdown
  logout(): void {
    this.authService.logout();
    this.closeProfileDropdown();
  }

  // Close menu on window resize (tablet and above)
  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth >= 992) {
      this.closeMenu();
    }
  }

  @HostListener('window:click', ['$event'])
  onClick(event: Event): void {
    const target = event.target as HTMLElement;

    // Handle menu closing
    if (
      this.isMenuOpen &&
      !target.closest('.header_menu-btn') &&
      !target.closest('.header_links')
    ) {
      this.closeMenu();
    }

    // Handle profile dropdown closing - only if not hovering
    if (
      this.isProfileDropdownOpen &&
      !target.closest('.header_profile-btn') &&
      !target.closest('.header_profile-dropdown')
    ) {
      // Clear any hover timeout
      if (this.hoverTimeout) {
        clearTimeout(this.hoverTimeout);
        this.hoverTimeout = null;
      }
      this.isProfileDropdownOpen = false;
    }
  }
}
