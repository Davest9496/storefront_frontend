import { Component } from '@angular/core';
import { CheckoutFormComponent } from '@app/components/forms/checkout-form/checkout-form.component';
import { SummaryComponent } from '@app/components/cart-summary/cart-summary.component';

@Component({
  selector: 'app-check-out',
  imports: [CheckoutFormComponent, SummaryComponent],
  templateUrl: './check-out.component.html',
  styleUrl: './check-out.component.scss'
})
export class CheckOutComponent {

}
