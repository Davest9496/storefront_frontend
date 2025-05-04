import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccountNavComponent } from '../../../components/account-nav/account-nav.component';

@Component({
  selector: 'app-account-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, AccountNavComponent],
  template: `
    <div class="account-layout">
      <div class="container">
        <div class="account-container">
          <aside class="account-sidebar">
            <app-account-nav></app-account-nav>
          </aside>
          <main class="account-content">
            <router-outlet></router-outlet>
          </main>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./account-layout.component.scss'],
})
export class AccountLayoutComponent {}
