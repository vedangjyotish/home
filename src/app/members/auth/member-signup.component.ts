import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MemberAuthService } from './member-auth.service';

@Component({
  selector: 'app-member-signup',
  template: `
    <div class="signup-container">
      <h2>Member Sign Up</h2>
      <form #signupForm="ngForm" (ngSubmit)="onSubmit(signupForm)">
        <div class="form-group">
          <label for="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            [(ngModel)]="memberData.name"
            required
            minlength="3"
            #nameInput="ngModel"
            [class.error]="nameInput.invalid && nameInput.touched">
          <div *ngIf="nameInput.invalid && nameInput.touched" class="error-message">
            Please enter your full name (minimum 3 characters)
          </div>
        </div>

        <div class="form-group">
          <label for="phone">Phone Number</label>
          <input
            type="text"
            id="phone"
            name="phone"
            [(ngModel)]="memberData.phone"
            required
            pattern="[0-9]{10}"
            #phoneInput="ngModel"
            (input)="onPhoneInput($event)"
            [class.error]="phoneInput.invalid && phoneInput.touched">
          <div *ngIf="phoneInput.invalid && phoneInput.touched" class="error-message">
            Please enter a valid 10-digit phone number
          </div>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            [(ngModel)]="memberData.password"
            required
            minlength="8"
            #passwordInput="ngModel"
            [class.error]="passwordInput.invalid && passwordInput.touched">
          <div *ngIf="passwordInput.invalid && passwordInput.touched" class="error-message">
            Password must be at least 8 characters long
          </div>
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            [(ngModel)]="confirmPassword"
            required
            #confirmPasswordInput="ngModel"
            [class.error]="confirmPasswordInput.value !== memberData.password && confirmPasswordInput.touched">
          <div *ngIf="confirmPasswordInput.value !== memberData.password && confirmPasswordInput.touched" class="error-message">
            Passwords do not match
          </div>
        </div>

        <button type="submit" [disabled]="signupForm.invalid || confirmPasswordInput.value !== memberData.password">
          Sign Up
        </button>
      </form>

      <div class="form-footer">
        <p>Already have an account? <a routerLink="/account">Login</a></p>
      </div>
    </div>
  `,
  styles: [`
    .signup-container {
      max-width: 400px;
      margin: 2rem auto;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      background-color: #f8f9fa;
      border: 1px solid #e9ecef;
    }

    h2 {
      font-size: 2.8rem;
      margin-bottom: 2.5rem;
      text-align: center;
      color: #2c3e50;
    }

    .form-group {
      margin-bottom: 2rem;
    }

    label {
      display: block;
      margin-bottom: 0.8rem;
      font-weight: 500;
      font-size: 1.6rem;
      color: #2c3e50;
    }

    input {
      width: 100%;
      padding: 1.2rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1.6rem;
    }

    input.error {
      border-color: #e74c3c;
    }

    .error-message {
      color: #e74c3c;
      font-size: 1.4rem;
      margin-top: 0.5rem;
    }

    button {
      width: 100%;
      padding: 1.4rem;
      background-color: #e74c3c;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1.6rem;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    button:hover {
      background-color: #c0392b;
    }

    button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .form-footer {
      margin-top: 2.5rem;
      text-align: center;
      font-size: 1.6rem;
    }

    a {
      color: #e74c3c;
      text-decoration: none;
      font-size: 1.6rem;
    }

    a:hover {
      text-decoration: underline;
    }
  `]
})
export class MemberSignupComponent {
  memberData = {
    name: '',
    phone: '',
    password: ''
  };
  confirmPassword = '';

  constructor(
    private authService: MemberAuthService,
    private router: Router
  ) {}

  onPhoneInput(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/\D/g, '').slice(0, 10);
    this.memberData.phone = input.value;
  }

  onSubmit(form: NgForm) {
    if (form.valid && this.memberData.password === this.confirmPassword) {
      this.authService.signup(this.memberData).subscribe({
        next: (response) => {
          console.log('Signup successful', response);
          this.router.navigate(['/account']);
        },
        error: (error) => {
          console.error('Signup failed', error);
          // Handle error (show message to user)
        }
      });
    }
  }
}
