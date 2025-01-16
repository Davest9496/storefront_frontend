import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-checkout-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout-form.component.html',
  styleUrls: ['./checkout-form.component.scss'],
})
export class CheckoutFormComponent implements OnInit {
  checkoutForm: FormGroup;
  @Output() formStatusChange = new EventEmitter<boolean>();
  @Output() formValuesChange = new EventEmitter<any>();

  // UK Phone number regex pattern
  private ukPhoneRegex =
    /^(?:(?:\+44\s?|0)(?:(?:(?:\d{2}\s?\d{4}\s?\d{4})|(?:\d{3}\s?\d{3}\s?\d{4})|(?:\d{4}\s?\d{6}))))$/;

  // UK Postcode regex pattern
  private ukPostcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;

  get showEMoneyFields(): boolean {
    return this.checkoutForm?.get('paymentMethod')?.value === 'e-Money';
  }

  constructor(private fb: FormBuilder) {
    this.checkoutForm = this.fb.group({
      // Billing Details
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(this.ukPhoneRegex)]],

      // Shipping Info
      addressLine1: ['', [Validators.required, Validators.minLength(5)]],
      addressLine2: [''],
      city: ['', Validators.required],
      county: [''],
      postcode: [
        '',
        [Validators.required, Validators.pattern(this.ukPostcodeRegex)],
      ],

      // Payment Details
      paymentMethod: ['e-Money', Validators.required],
      eMoneyNumber: [''],
      eMoneyPin: [''],
    });
  }

  ngOnInit(): void {
    // Monitor form changes
    this.checkoutForm.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.checkAndEmitFormStatus();
      });

    // Handle payment method changes
    this.checkoutForm.get('paymentMethod')?.valueChanges.subscribe((method) => {
      this.handlePaymentMethodChange(method);
    });
  }

  private checkAndEmitFormStatus(): void {
    const isValid = this.checkoutForm.valid;

    // Required fields based on payment method
    const requiredFields = [
      'name',
      'email',
      'phone',
      'addressLine1',
      'city',
      'postcode',
    ];

    if (this.showEMoneyFields) {
      requiredFields.push('eMoneyNumber', 'eMoneyPin');
    }

    const allRequiredFieldsFilled = requiredFields.every((field) => {
      const control = this.checkoutForm.get(field);
      return control?.valid && control.value !== '';
    });

    this.formStatusChange.emit(allRequiredFieldsFilled);

    if (allRequiredFieldsFilled) {
      this.formValuesChange.emit(this.checkoutForm.value);
    }
  }

  private handlePaymentMethodChange(method: string): void {
    const eMoneyNumber = this.checkoutForm.get('eMoneyNumber');
    const eMoneyPin = this.checkoutForm.get('eMoneyPin');

    if (method === 'e-Money') {
      eMoneyNumber?.setValidators([
        Validators.required,
        Validators.pattern(/^\d{9}$/),
      ]);
      eMoneyPin?.setValidators([
        Validators.required,
        Validators.pattern(/^\d{4}$/),
      ]);
    } else {
      eMoneyNumber?.clearValidators();
      eMoneyPin?.clearValidators();
      eMoneyNumber?.setValue('');
      eMoneyPin?.setValue('');
    }

    eMoneyNumber?.updateValueAndValidity();
    eMoneyPin?.updateValueAndValidity();

    this.checkAndEmitFormStatus();
  }
}
