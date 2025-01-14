import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutFormComponent } from '../../components/forms/checkout-form/checkout-form.component';
import { SummaryComponent } from '@app/components/cart-summary/cart-summary.component';

interface CheckoutFormData {
  name: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  county?: string;
  postcode: string;
  paymentMethod: 'e-Money' | 'cash';
  eMoneyNumber?: string;
  eMoneyPin?: string;
}

@Component({
  selector: 'app-check-out',
  standalone: true,
  imports: [CommonModule, CheckoutFormComponent, SummaryComponent],
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.scss'],
})
export class CheckOutComponent {
  onFormStatusChange(isValid: boolean): void {
    console.log('Form validity status:', isValid);
  }

  onFormValuesChange(formData: CheckoutFormData): void {
    console.log('Form data:', formData);
    // Handle the form data here - e.g., send to a service
    if (formData.paymentMethod === 'e-Money') {
      // Handle e-money payment
      console.log('Processing e-money payment');
    } else {
      // Handle cash on delivery
      console.log('Processing cash on delivery');
    }
  }
}
