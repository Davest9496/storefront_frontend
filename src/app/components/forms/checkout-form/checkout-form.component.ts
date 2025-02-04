import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface FormData {
  name: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  county: string;
  postcode: string;
  paymentMethod: 'e-Money' | 'cash';
  eMoneyNumber: string;
  eMoneyPin: string;
}

type ErrorFields = {
  [K in keyof FormData]?: boolean;
};

@Component({
  selector: 'app-checkout-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout-form.component.html',
  styleUrls: ['./checkout-form.component.scss'],
})
export class CheckoutFormComponent implements OnInit {
  @Output() formStatusChange = new EventEmitter<boolean>();
  @Output() formValuesChange = new EventEmitter<FormData>();

  formData: FormData = {
    name: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    county: '',
    postcode: '',
    paymentMethod: 'e-Money',
    eMoneyNumber: '',
    eMoneyPin: '',
  };

  patterns = {
    phone:
      /^(?:(?:\+44\s?|0)(?:(?:(?:\d{2}\s?\d{4}\s?\d{4})|(?:\d{3}\s?\d{3}\s?\d{4})|(?:\d{4}\s?\d{6}))))$/,
    postcode: /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i,
    eMoneyNumber: /^\d{9}$/,
    eMoneyPin: /^\d{4}$/,
  };

  errors: ErrorFields = {};

  get showEMoneyFields(): boolean {
    return this.formData.paymentMethod === 'e-Money';
  }

  ngOnInit(): void {
    this.validateForm();
  }

  // Separate method for handling payment method changes
  onPaymentMethodChange(value: 'e-Money' | 'cash') {
    this.formData.paymentMethod = value;
    if (!this.showEMoneyFields) {
      this.formData.eMoneyNumber = '';
      this.formData.eMoneyPin = '';
      delete this.errors['eMoneyNumber'];
      delete this.errors['eMoneyPin'];
    }
    this.validateForm();
  }

  // Type-safe method for handling string inputs
  onStringInputChange(
    field: Exclude<keyof FormData, 'paymentMethod'>,
    value: string
  ) {
    // @ts-ignore - We know this is safe because we excluded paymentMethod
    this.formData[field] = value;
    this.validateField(field);
    this.validateForm();
  }

  validateField(field: keyof FormData) {
    const value = this.formData[field];
    this.errors[field] = false;

    switch (field) {
      case 'name':
        if (!value || value.length < 2) {
          this.errors[field] = true;
        }
        break;
      case 'email':
        if (!value || !value.includes('@')) {
          this.errors[field] = true;
        }
        break;
      case 'phone':
        if (!value || !this.patterns.phone.test(value)) {
          this.errors[field] = true;
        }
        break;
      case 'addressLine1':
        if (!value || value.length < 5) {
          this.errors[field] = true;
        }
        break;
      case 'city':
        if (!value) {
          this.errors[field] = true;
        }
        break;
      case 'postcode':
        if (!value || !this.patterns.postcode.test(value)) {
          this.errors[field] = true;
        }
        break;
      case 'eMoneyNumber':
        if (
          this.showEMoneyFields &&
          (!value || !this.patterns.eMoneyNumber.test(value))
        ) {
          this.errors[field] = true;
        }
        break;
      case 'eMoneyPin':
        if (
          this.showEMoneyFields &&
          (!value || !this.patterns.eMoneyPin.test(value))
        ) {
          this.errors[field] = true;
        }
        break;
    }
  }

  validateForm() {
    (Object.keys(this.formData) as Array<keyof FormData>).forEach((field) => {
      this.validateField(field);
    });

    const isValid = !Object.values(this.errors).some((error) => error);

    this.formStatusChange.emit(isValid);
    if (isValid) {
      this.formValuesChange.emit(this.formData);
    }
  }
}
