import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, SignupData } from '../../../services/auth.service';
import { InlinePasswordToggleDirective } from '../../../shared/inline-password-toggle.directive';

@Component({
  selector: 'app-sign-up-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    InlinePasswordToggleDirective,
  ],
  template: `
    <form class="sign-up-form" (ngSubmit)="onSubmit()" #signUpForm="ngForm">
      <div class="form-row">
        <div class="form-group">
          <label for="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            [(ngModel)]="formData.firstName"
            required
            minlength="2"
            #firstName="ngModel"
            [class.error]="
              firstName.invalid && (firstName.dirty || firstName.touched)
            "
            placeholder="John"
          />
          <div
            class="error-message"
            *ngIf="firstName.invalid && (firstName.dirty || firstName.touched)"
          >
            <span *ngIf="firstName.errors?.['required']"
              >First name is required</span
            >
            <span *ngIf="firstName.errors?.['minlength']"
              >First name must be at least 2 characters</span
            >
          </div>
        </div>

        <div class="form-group">
          <label for="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            [(ngModel)]="formData.lastName"
            required
            minlength="2"
            #lastName="ngModel"
            [class.error]="
              lastName.invalid && (lastName.dirty || lastName.touched)
            "
            placeholder="Smith"
          />
          <div
            class="error-message"
            *ngIf="lastName.invalid && (lastName.dirty || lastName.touched)"
          >
            <span *ngIf="lastName.errors?.['required']"
              >Last name is required</span
            >
            <span *ngIf="lastName.errors?.['minlength']"
              >Last name must be at least 2 characters</span
            >
          </div>
        </div>
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          [(ngModel)]="formData.email"
          required
          email
          #email="ngModel"
          [class.error]="email.invalid && (email.dirty || email.touched)"
          placeholder="john.smith@example.com"
        />
        <div
          class="error-message"
          *ngIf="email.invalid && (email.dirty || email.touched)"
        >
          <span *ngIf="email.errors?.['required']">Email is required</span>
          <span *ngIf="email.errors?.['email']"
            >Please enter a valid email</span
          >
        </div>
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          [(ngModel)]="formData.password"
          required
          minlength="8"
          pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d\\w\\W]{8,}$"
          #password="ngModel"
          [class.error]="
            password.invalid && (password.dirty || password.touched)
          "
          placeholder="Create a password"
          appInlinePasswordToggle
        />
        <div
          class="error-message"
          *ngIf="password.invalid && (password.dirty || password.touched)"
        >
          <span *ngIf="password.errors?.['required']"
            >Password is required</span
          >
          <span
            *ngIf="
              password.errors?.['minlength'] || password.errors?.['pattern']
            "
            >Password must be at least 8 characters and include uppercase,
            lowercase, and number</span
          >
        </div>
      </div>

      <div class="form-group">
        <label for="passwordConfirm">Confirm Password</label>
        <input
          type="password"
          id="passwordConfirm"
          name="passwordConfirm"
          [(ngModel)]="formData.passwordConfirm"
          required
          #passwordConfirm="ngModel"
          [class.error]="
            (passwordConfirm.value !== formData.password &&
              (passwordConfirm.dirty || passwordConfirm.touched)) ||
            passwordMismatch
          "
          placeholder="Confirm your password"
          appInlinePasswordToggle
        />
        <div
          class="error-message"
          *ngIf="
            (passwordConfirm.value !== formData.password &&
              (passwordConfirm.dirty || passwordConfirm.touched)) ||
            passwordMismatch
          "
        >
          Passwords do not match
        </div>
      </div>

      <!-- API Error message -->
      <div class="error-message api-error" *ngIf="errorMessage">
        {{ errorMessage }}
      </div>

      <button
        type="submit"
        [disabled]="
          signUpForm.invalid ||
          isLoading ||
          formData.password !== formData.passwordConfirm
        "
        class="submit-btn"
      >
        {{ isLoading ? 'Creating Account...' : 'CREATE ACCOUNT' }}
      </button>

      <div class="form-footer">
        <p>Already have an account? <a routerLink="/auth/login">Sign in</a></p>
      </div>
    </form>
  `,
  styleUrls: ['./sign-up-form.component.scss'],
})
export class SignUpFormComponent {
  formData: SignupData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirm: '',
  };

  isLoading = false;
  errorMessage = '';
  passwordMismatch = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onSubmit() {
    if (this.isLoading || this.validateForm() === false) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.signup(this.formData).subscribe({
      next: () => {
        this.isLoading = false;
        // Redirect to stored URL or home
        const redirectUrl = sessionStorage.getItem('redirectUrl') || '/';
        sessionStorage.removeItem('redirectUrl');
        this.router.navigateByUrl(redirectUrl);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage =
          error.message || 'Failed to create account. Please try again.';
      },
    });
  }

  validateForm(): boolean {
    // Check if passwords match
    if (this.formData.password !== this.formData.passwordConfirm) {
      this.passwordMismatch = true;
      return false;
    }

    this.passwordMismatch = false;
    return true;
  }
}
