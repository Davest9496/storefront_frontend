import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-checkout-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout-form.component.html',
  styleUrls: ['./checkout-form.component.scss'],
})
export class CheckoutFormComponent implements OnInit {
  checkoutForm: FormGroup;

  constructor(private fb: FormBuilder) {
    // Initialize the form with all necessary fields and validation
    this.checkoutForm = this.fb.group({
      // Billing details section
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],

      // Shipping info section
      address: ['', Validators.required],
      postCode: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],

      // Payment details section
      paymentMethod: ['e-Money', Validators.required],
      eMoneyNumber: [''],
      eMoneyPin: [''],
    });
  }

  ngOnInit(): void {
    // Add conditional validation for e-Money fields
    this.checkoutForm.get('paymentMethod')?.valueChanges.subscribe((method) => {
      const eMoneyNumber = this.checkoutForm.get('eMoneyNumber');
      const eMoneyPin = this.checkoutForm.get('eMoneyPin');

      if (method === 'e-Money') {
        eMoneyNumber?.setValidators([Validators.required]);
        eMoneyPin?.setValidators([Validators.required]);
      } else {
        eMoneyNumber?.clearValidators();
        eMoneyPin?.clearValidators();
      }

      eMoneyNumber?.updateValueAndValidity();
      eMoneyPin?.updateValueAndValidity();
    });
  }

  // Helper getter to check if e-Money fields should be shown
  get showEMoneyFields(): boolean {
    return this.checkoutForm.get('paymentMethod')?.value === 'e-Money';
  }

  // Form submission handler
  onSubmit(): void {
    if (this.checkoutForm.valid) {
      console.log(this.checkoutForm.value);
      // Handle logic here -- Checkout
    } else {
      // Mark all fields as touched to trigger validation display
      Object.keys(this.checkoutForm.controls).forEach((key) => {
        const control = this.checkoutForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}
