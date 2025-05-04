import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignUpFormComponent } from '../../../components/forms/sign-up-form/sign-up-form.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, SignUpFormComponent],
  template: `
    <div class="auth-page">
      <div class="auth-container">
        <h1 class="page-title">CREATE ACCOUNT</h1>
        <app-sign-up-form></app-sign-up-form>
      </div>
    </div>
  `,
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {}
