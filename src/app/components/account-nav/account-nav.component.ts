import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-account-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="account-nav">
      <div class="account-user" *ngIf="user$ | async as user">
        <div class="user-avatar">
          {{ getUserInitials(user) }}
        </div>
        <div class="user-info">
          <div class="user-name">{{ user.firstName }} {{ user.lastName }}</div>
          <div class="user-email">{{ user.email }}</div>
        </div>
      </div>

      <ul class="nav-list">
        <!-- Rest of your navigation template -->
      </ul>
    </div>
  `,
  styleUrls: ['./account-nav.component.scss'],
})
export class AccountNavComponent implements OnInit {
  user$!: Observable<User | null>;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.user$ = this.authService.getCurrentUser();
  }

  getUserInitials(user: User): string {
    if (!user) return '';

    const firstInitial = user.firstName.charAt(0);
    const lastInitial = user.lastName.charAt(0);
    return `${firstInitial}${lastInitial}`.toUpperCase();
  }

  logout() {
    this.authService.logout();
  }
}
