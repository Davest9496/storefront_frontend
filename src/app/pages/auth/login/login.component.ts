import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInFormComponent } from '../../../components/forms/sign-in-form/sign-in-form.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, SignInFormComponent],
  template: `
    <div class="auth-page">
      <div class="auth-container">
        <h1 class="page-title">LOGIN</h1>
        <app-sign-in-form></app-sign-in-form>
      </div>
    </div>
  `,
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {}
