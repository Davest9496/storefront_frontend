import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-page">
      <div class="auth-container">
        <h1 class="page-title">FORGOT PASSWORD</h1>

        <div *ngIf="!emailSent" class="forgot-password-form">
          <p class="form-description">
            Enter your email address below and we'll send you a link to reset
            your password.
          </p>

          <form (ngSubmit)="onSubmit()" #forgotForm="ngForm">
            <div class="form-group">
              <label for="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                [(ngModel)]="email"
                required
                email
                #emailField="ngModel"
                [class.error]="emailField.invalid && emailField.touched"
                placeholder="Enter your email"
              />
              <div
                class="error-message"
                *ngIf="emailField.touched && emailField.invalid"
              >
                <span *ngIf="emailField.errors?.['required']"
                  >Email is required</span
                >
                <span *ngIf="emailField.errors?.['email']"
                  >Please enter a valid email</span
                >
              </div>
            </div>

            <!-- Error message from API -->
            <div class="error-message api-error" *ngIf="errorMessage">
              {{ errorMessage }}
            </div>

            <button
              type="submit"
              [disabled]="forgotForm.invalid || isLoading"
              class="submit-btn"
            >
              {{ isLoading ? 'Sending...' : 'SEND RESET LINK' }}
            </button>
          </form>

          <div class="form-footer">
            <p><a routerLink="/auth/login">Back to login</a></p>
          </div>
        </div>

        <div *ngIf="emailSent" class="success-message">
          <h2>Email Sent!</h2>
          <p>
            We've sent a password reset link to <strong>{{ email }}</strong
            >.
          </p>
          <p>
            Please check your inbox and follow the instructions to reset your
            password.
          </p>
          <p>
            If you don't receive an email within a few minutes, please check
            your spam folder.
          </p>
          <div class="button-container">
            <button class="back-btn" routerLink="/auth/login">
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  email = '';
  isLoading = false;
  errorMessage = '';
  emailSent = false;

  constructor(private http: HttpClient) {}

  onSubmit() {
    if (this.isLoading || !this.email) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.http
      .post(`${environment.apiUrl}/users/forgot-password`, {
        email: this.email,
      })
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.emailSent = true;
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage =
            error.error?.message ||
            'Failed to send reset email. Please try again.';
        },
      });
  }
}
