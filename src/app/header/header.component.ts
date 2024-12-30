import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  isMenuOpen = false;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) {
      document.body.classList.add('menu-active');
    } else {
      document.body.classList.remove('menu-active');
    }
  }

  // Close menu when screen size changes to tablet
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    if (window.innerWidth >= 992 && this.isMenuOpen) {
      this.isMenuOpen = false;
      document.body.classList.remove('menu-active');
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
      this.isMenuOpen = false;
      document.body.classList.remove('menu-active');
    }
  }
}
