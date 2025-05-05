import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';
import { InlinePasswordToggleDirective } from '../../shared/inline-password-toggle.directive';

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  passwordConfirm: string;
}

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    InlinePasswordToggleDirective,
  ],
  template: `
    <div class="change-password-page">
      <div class="password-container">
        <h1 class="page-title">CHANGE PASSWORD</h1>

        <form (ngSubmit)="onSubmit()" #passwordForm="ngForm">
          <div class="form-group">
            <label for="currentPassword">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              [(ngModel)]="formData.currentPassword"
              required
              #currentPassword="ngModel"
              [class.error]="currentPassword.invalid && currentPassword.touched"
              placeholder="Enter your current password"
              appInlinePasswordToggle
            />
            <div
              class="error-message"
              *ngIf="currentPassword.touched && currentPassword.invalid"
            >
              <span *ngIf="currentPassword.errors?.['required']">
                Current password is required
              </span>
            </div>
          </div>

          <div class="form-group">
            <label for="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              [(ngModel)]="formData.newPassword"
              required
              minlength="8"
              pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d\\w\\W]{8,}$"
              #newPassword="ngModel"
              [class.error]="newPassword.invalid && newPassword.touched"
              placeholder="Create a new password"
              appInlinePasswordToggle
            />
            <div
              class="error-message"
              *ngIf="newPassword.touched && newPassword.invalid"
            >
              <span *ngIf="newPassword.errors?.['required']">
                New password is required
              </span>
              <span
                *ngIf="
                  newPassword.errors?.['minlength'] ||
                  newPassword.errors?.['pattern']
                "
              >
                Password must be at least 8 characters and include uppercase,
                lowercase, and number
              </span>
            </div>
          </div>

          <div class="form-group">
            <label for="passwordConfirm">Confirm New Password</label>
            <input
              type="password"
              id="passwordConfirm"
              name="passwordConfirm"
              [(ngModel)]="formData.passwordConfirm"
              required
              #passwordConfirm="ngModel"
              [class.error]="
                passwordConfirm.touched &&
                formData.newPassword !== formData.passwordConfirm
              "
              placeholder="Confirm your new password"
              appInlinePasswordToggle
            />
            <div
              class="error-message"
              *ngIf="
                passwordConfirm.touched &&
                formData.newPassword !== formData.passwordConfirm
              "
            >
              Passwords do not match
            </div>
          </div>

          <!-- Success message -->
          <div *ngIf="updateSuccess" class="success-message">
            Your password has been changed successfully!
          </div>

          <!-- Error message from API -->
          <div class="error-message api-error" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <div class="button-row">
            <button type="button" class="cancel-btn" (click)="goBack()">
              CANCEL
            </button>

            <button
              type="submit"
              [disabled]="
                passwordForm.invalid ||
                isLoading ||
                formData.newPassword !== formData.passwordConfirm
              "
              class="save-btn"
            >
              {{ isLoading ? 'UPDATING...' : 'UPDATE PASSWORD' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent {
  formData: PasswordFormData = {
    currentPassword: '',
    newPassword: '',
    passwordConfirm: '',
  };

  isLoading = false;
  errorMessage = '';
  updateSuccess = false;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  onSubmit() {
    if (this.isLoading || !this.validateForm()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const passwordData = {
      currentPassword: this.formData.currentPassword,
      newPassword: this.formData.newPassword,
      passwordConfirm: this.formData.passwordConfirm,
    };

    this.http
      .patch(`${environment.apiUrl}/auth/update-password`, passwordData)
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.updateSuccess = true;

          // Reset form
          this.formData = {
            currentPassword: '',
            newPassword: '',
            passwordConfirm: '',
          };

          // Redirect to profile after success
          setTimeout(() => {
            this.router.navigate(['/account/profile']);
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage =
            error.error?.message ||
            'Failed to update password. Please try again.';
        },
      });
  }

  validateForm(): boolean {
    return this.formData.newPassword === this.formData.passwordConfirm;
  }

  goBack() {
    this.router.navigate(['/account/profile']);
  }
}
