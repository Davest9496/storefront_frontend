import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-auth-header-links',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <ng-container
      *ngIf="(isLoggedIn$ | async) === false; else loggedInTemplate"
    >
      <!-- Not logged in -->
      <div class="auth-links">
        <a routerLink="/auth/login" class="auth-link">Login</a>
        <a routerLink="/auth/signup" class="auth-link signup">Sign Up</a>
      </div>
    </ng-container>

    <ng-template #loggedInTemplate>
      <!-- Logged in -->
      <div class="profile-dropdown" [class.open]="dropdownOpen">
        <button
          class="profile-button"
          (click)="toggleDropdown()"
          (blur)="closeDropdown()"
        >
          <div class="avatar">{{ getUserInitials() }}</div>
          <span class="name" *ngIf="user$ | async as user">{{
            user.firstName
          }}</span>
        </button>

        <div class="dropdown-menu" *ngIf="dropdownOpen">
          <a routerLink="/account/profile" class="dropdown-item">
            <i class="dropdown-icon profile-icon"></i>
            My Profile
          </a>
          <a routerLink="/account/orders" class="dropdown-item">
            <i class="dropdown-icon orders-icon"></i>
            My Orders
          </a>
          <button class="dropdown-item logout" (click)="logout()">
            <i class="dropdown-icon logout-icon"></i>
            Logout
          </button>
        </div>
      </div>
    </ng-template>
  `,
  styleUrls: ['./auth-header-links.component.scss'],
})
export class AuthHeaderLinksComponent implements OnInit {
  isLoggedIn$!: Observable<boolean>;
  user$!: Observable<User | null>;
  dropdownOpen = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn();
    this.user$ = this.authService.getCurrentUser();
  }

  getUserInitials(): string {
    const user = this.authService.currentUserValue;
    if (!user) return '';

    const firstInitial = user.firstName.charAt(0);
    const lastInitial = user.lastName.charAt(0);
    return `${firstInitial}${lastInitial}`.toUpperCase();
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown(): void {
    // Use setTimeout to allow for click events to process before closing
    setTimeout(() => {
      this.dropdownOpen = false;
    }, 100);
  }

  logout(): void {
    this.authService.logout();
    this.dropdownOpen = false;
  }
}
