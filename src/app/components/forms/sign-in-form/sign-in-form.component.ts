import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginCredentials } from '../../../services/auth.service';

@Component({
  selector: 'app-sign-in-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form class="sign-in-form" (ngSubmit)="onSubmit()" #signInForm="ngForm">
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
          [class.error]="email.invalid && email.touched"
          placeholder="Enter your email"
        />
        <div class="error-message" *ngIf="email.touched && email.invalid">
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
          minlength="6"
          #password="ngModel"
          [class.error]="password.invalid && password.touched"
          placeholder="Enter your password"
        />
        <div class="error-message" *ngIf="password.touched && password.invalid">
          <span *ngIf="password.errors?.['required']"
            >Password is required</span
          >
          <span *ngIf="password.errors?.['minlength']"
            >Password must be at least 6 characters</span
          >
        </div>
      </div>

      <!-- Error message from API -->
      <div class="error-message api-error" *ngIf="errorMessage">
        {{ errorMessage }}
      </div>

      <button
        type="submit"
        [disabled]="signInForm.invalid || isLoading"
        class="submit-btn"
      >
        {{ isLoading ? 'Signing in...' : 'SIGN IN' }}
      </button>

      <div class="form-footer">
        <p>Don't have an account? <a routerLink="/auth/signup">Sign up</a></p>
      </div>
    </form>
  `,
  styleUrls: ['./sign-in-form.component.scss'],
})
export class SignInFormComponent {
  formData: LoginCredentials = {
    email: '',
    password: '',
  };

  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onSubmit() {
    if (this.isLoading || !this.formData.email || !this.formData.password) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.formData).subscribe({
      next: () => {
        this.isLoading = false;
        // Redirect to stored URL or home
        const redirectUrl = sessionStorage.getItem('redirectUrl') || '/';
        sessionStorage.removeItem('redirectUrl');
        this.router.navigateByUrl(redirectUrl);
      },
      error: (error) => {
        this.isLoading = false;

        // Check if there's a direct error message from the server
        if (error.error && typeof error.error === 'string') {
          this.errorMessage = error.error;
        }
        // Check if error has a message property
        else if (error.message) {
          this.errorMessage = error.message;
        }
        // Fallback to a generic message
        else {
          this.errorMessage = 'Failed to sign in. Please try again later.';
        }

        console.error('Login error:', error);
      },
    });
  }
}
