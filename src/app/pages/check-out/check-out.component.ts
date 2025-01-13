import { Component } from '@angular/core';
import { CheckoutFormComponent } from '@app/components/forms/checkout-form/checkout-form.component';
import { SummaryComponent } from '@app/components/cart-summary/cart-summary.component';
import { CartService } from '@app/services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-check-out',
  standalone: true,
  imports: [CheckoutFormComponent, SummaryComponent],
  templateUrl: './check-out.component.html',
  styleUrl: './check-out.component.scss',
})
export class CheckOutComponent {
  constructor(private cartService: CartService, private router: Router) {

    if (this.cartService.getCurrentItems().length === 0) {
      this.router.navigate(['/']);
    }
  }
}
