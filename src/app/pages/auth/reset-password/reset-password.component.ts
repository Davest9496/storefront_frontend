import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-page">
      <div class="auth-container">
        <h1 class="page-title">RESET PASSWORD</h1>

        <div *ngIf="!resetSuccess" class="reset-password-form">
          <p class="form-description">
            Create a new password for your account.
          </p>

          <form (ngSubmit)="onSubmit()" #resetForm="ngForm">
            <div class="form-group">
              <label for="password">New Password</label>
              <input
                type="password"
                id="password"
                name="password"
                [(ngModel)]="password"
                required
                minlength="8"
                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d\\w\\W]{8,}$"
                #passwordField="ngModel"
                [class.error]="passwordField.invalid && passwordField.touched"
                placeholder="Create a new password"
              />
              <div
                class="error-message"
                *ngIf="passwordField.touched && passwordField.invalid"
              >
                <span *ngIf="passwordField.errors?.['required']"
                  >Password is required</span
                >
                <span
                  *ngIf="
                    passwordField.errors?.['minlength'] ||
                    passwordField.errors?.['pattern']
                  "
                >
                  Password must be at least 8 characters and include uppercase,
                  lowercase, and number
                </span>
              </div>
            </div>

            <div class="form-group">
              <label for="passwordConfirm">Confirm Password</label>
              <input
                type="password"
                id="passwordConfirm"
                name="passwordConfirm"
                [(ngModel)]="passwordConfirm"
                required
                #passwordConfirmField="ngModel"
                [class.error]="
                  (passwordConfirmField.touched &&
                    password !== passwordConfirm) ||
                  passwordMismatch
                "
                placeholder="Confirm your password"
              />
              <div
                class="error-message"
                *ngIf="
                  (passwordConfirmField.touched &&
                    password !== passwordConfirm) ||
                  passwordMismatch
                "
              >
                Passwords do not match
              </div>
            </div>

            <!-- Error message from API -->
            <div class="error-message api-error" *ngIf="errorMessage">
              {{ errorMessage }}
            </div>

            <button
              type="submit"
              [disabled]="
                resetForm.invalid || isLoading || password !== passwordConfirm
              "
              class="submit-btn"
            >
              {{ isLoading ? 'Resetting...' : 'RESET PASSWORD' }}
            </button>
          </form>
        </div>

        <div *ngIf="resetSuccess" class="success-message">
          <h2>Password Reset Successful!</h2>
          <p>Your password has been successfully reset.</p>
          <div class="button-container">
            <button class="back-btn" routerLink="/auth/login">
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  token = '';
  password = '';
  passwordConfirm = '';
  isLoading = false;
  errorMessage = '';
  resetSuccess = false;
  passwordMismatch = false;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    // Get token from URL
    this.route.params.subscribe((params) => {
      this.token = params['token'];

      if (!this.token) {
        this.errorMessage = 'Invalid password reset token.';
        setTimeout(() => {
          this.router.navigate(['/auth/forgot-password']);
        }, 3000);
      }
    });
  }

  onSubmit() {
    if (this.isLoading || !this.validateForm()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const resetData = {
      token: this.token,
      password: this.password,
      passwordConfirm: this.passwordConfirm,
    };

    this.http
      .post(`${environment.apiUrl}/users/reset-password`, resetData)
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.resetSuccess = true;
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage =
            error.error?.message ||
            'Failed to reset password. Please try again.';
        },
      });
  }

  validateForm(): boolean {
    if (this.password !== this.passwordConfirm) {
      this.passwordMismatch = true;
      return false;
    }

    this.passwordMismatch = false;
    return true;
  }
}
