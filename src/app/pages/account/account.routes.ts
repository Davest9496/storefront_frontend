import { Routes } from '@angular/router';
import { ProfileComponent } from '../../components/profile/profile.component';
import { ChangePasswordComponent } from '../../components/change-password/change-password.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { AuthGuard } from '../../guards/auth.guard';
import { AccountLayoutComponent } from './account-layout/account-layout.component';

export const ACCOUNT_ROUTES: Routes = [
  {
    path: '',
    component: AccountLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'profile',
        pathMatch: 'full'
      },
      {
        path: 'profile',
        component: ProfileComponent,
        title: 'Your Profile'
      },
      {
        path: 'change-password',
        component: ChangePasswordComponent,
        title: 'Change Password'
      },
      {
        path: 'orders',
        component: OrderHistoryComponent,
        title: 'Order History'
      },
      {
        path: 'orders/:id',
        component: OrderDetailsComponent,
        title: 'Order Details'
      }
    ]
  }
];