import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService, User } from '../../services/auth.service';
import { Router } from '@angular/router';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="profile-page">
      <div class="profile-container">
        <h1 class="page-title">YOUR PROFILE</h1>

        <div *ngIf="loading" class="loading-message">
          <p>Loading your profile information...</p>
        </div>

        <div *ngIf="error" class="error-message api-error">
          {{ error }}
        </div>

        <div *ngIf="!loading && !error" class="profile-content">
          <form (ngSubmit)="onSubmit()" #profileForm="ngForm">
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
                  [class.error]="firstName.invalid && firstName.touched"
                  placeholder="First Name"
                />
                <div
                  class="error-message"
                  *ngIf="firstName.touched && firstName.invalid"
                >
                  <span *ngIf="firstName.errors?.['required']"
                    >First name is required</span
                  >
                  <span *ngIf="firstName.errors?.['minlength']">
                    First name must be at least 2 characters
                  </span>
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
                  [class.error]="lastName.invalid && lastName.touched"
                  placeholder="Last Name"
                />
                <div
                  class="error-message"
                  *ngIf="lastName.touched && lastName.invalid"
                >
                  <span *ngIf="lastName.errors?.['required']"
                    >Last name is required</span
                  >
                  <span *ngIf="lastName.errors?.['minlength']">
                    Last name must be at least 2 characters
                  </span>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                [(ngModel)]="formData.email"
                required
                email
                #email="ngModel"
                [class.error]="email.invalid && email.touched"
                placeholder="Email Address"
              />
              <div class="error-message" *ngIf="email.touched && email.invalid">
                <span *ngIf="email.errors?.['required']"
                  >Email is required</span
                >
                <span *ngIf="email.errors?.['email']">
                  Please enter a valid email address
                </span>
              </div>
            </div>

            <!-- Update Password Link -->
            <div class="password-section">
              <p>Password: ••••••••••</p>
              <a
                routerLink="/account/change-password"
                class="change-password-link"
              >
                Change Password
              </a>
            </div>

            <!-- Success message -->
            <div *ngIf="updateSuccess" class="success-message">
              Your profile has been updated successfully!
            </div>

            <!-- Error message from API -->
            <div class="error-message api-error" *ngIf="updateError">
              {{ updateError }}
            </div>

            <div class="button-row">
              <button
                type="submit"
                [disabled]="profileForm.invalid || isSaving"
                class="save-btn"
              >
                {{ isSaving ? 'SAVING...' : 'SAVE CHANGES' }}
              </button>

              <button type="button" class="logout-btn" (click)="logout()">
                LOGOUT
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  formData: ProfileFormData = {
    firstName: '',
    lastName: '',
    email: '',
  };

  loading = true;
  error = '';
  isSaving = false;
  updateSuccess = false;
  updateError = '';

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.loading = true;
    this.error = '';

    this.authService.refreshUserProfile().subscribe({
      next: (user) => {
        this.user = user;
        this.formData = {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        };
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.error =
          error.message || 'Failed to load your profile. Please try again.';
      },
    });
  }

  onSubmit() {
    if (this.isSaving) {
      return;
    }

    this.isSaving = true;
    this.updateSuccess = false;
    this.updateError = '';

    this.http
      .patch(`${environment.apiUrl}/users/profile`, this.formData)
      .subscribe({
        next: (response: any) => {
          this.isSaving = false;
          this.updateSuccess = true;

          // Update user in auth service
          if (response.data && response.data.user) {
            this.user = response.data.user;
            // Update local storage user
            localStorage.setItem('user', JSON.stringify(this.user));
          }

          // Hide success message after 3 seconds
          setTimeout(() => {
            this.updateSuccess = false;
          }, 3000);
        },
        error: (error) => {
          this.isSaving = false;
          this.updateError =
            error.error?.message ||
            'Failed to update profile. Please try again.';
        },
      });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
