import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentAuthService } from './student-auth.service';

interface SignupData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    name: string;
    id: string;
    type: string;
    enrolledCourses: string[];
  };
}

@Component({
  selector: 'app-student-signup',
  template: `
    <div class="accountContainer">
      <div class="login-card">
        <h2>Student Sign Up</h2>
        <form #signupForm="ngForm" (ngSubmit)="onSubmit(signupForm)" class="form">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              [(ngModel)]="studentData.name"
              required
              minlength="3"
              #nameInput="ngModel"
              placeholder="Enter your full name"
              [class.error]="nameInput.invalid && nameInput.touched">
            <div *ngIf="nameInput.invalid && nameInput.touched" class="error-message">
              Please enter your full name (minimum 3 characters)
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              [(ngModel)]="studentData.email"
              required
              email
              #emailInput="ngModel"
              placeholder="Enter your email"
              [class.error]="emailInput.invalid && emailInput.touched">
            <div *ngIf="emailInput.invalid && emailInput.touched" class="error-message">
              Please enter a valid email address
            </div>
          </div>

          <div class="form-group">
            <label for="phone">Phone Number</label>
            <input
              type="text"
              id="phone"
              name="phone"
              [(ngModel)]="studentData.phone"
              required
              pattern="[0-9]{10}"
              #phoneInput="ngModel"
              placeholder="Enter your phone number"
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
              [(ngModel)]="studentData.password"
              required
              minlength="8"
              #passwordInput="ngModel"
              placeholder="Enter your password"
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
              placeholder="Confirm your password"
              #confirmPasswordInput="ngModel"
              [class.error]="confirmPasswordInput.touched && studentData.password !== confirmPassword">
            <div *ngIf="confirmPasswordInput.touched && studentData.password !== confirmPassword" class="error-message">
              Passwords do not match
            </div>
          </div>

          <button type="submit" class="login_btn" [disabled]="!signupForm.valid || studentData.password !== confirmPassword">
            Sign Up
          </button>

          <div class="form-footer">
            <p>Already have an account? <a [routerLink]="['/account']" class="signup-link">Login</a></p>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      font-family: var(--body-font);
    }

    .accountContainer {
      background-color: #f1d9d9;
      min-height: calc(100vh - 12rem);
      font-family: "Poppins", sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 4rem 2rem;
      margin: 2rem auto;
      max-width: 140rem;
    }

    .login-card {
      background: #fff;
      border-radius: 2rem;
      box-shadow: 0 0.8rem 2rem rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 48rem;
      padding: 3.5rem;
      position: relative;
    }

    h2 {
      font-family: var(--head-font);
      font-size: 2.4rem;
      color: #861400;
      text-align: center;
      margin-bottom: 3rem;
    }

    .form {
      display: flex;
      flex-direction: column;
      width: 100%;
    }

    .form-group {
      margin-bottom: 2rem;
    }

    label {
      display: block;
      font-size: 1.6rem;
      color: #34495e;
      margin-bottom: 0.8rem;
    }

    input {
      width: 100%;
      padding: 1.2rem;
      border: 1px solid #ddd;
      border-radius: 0.8rem;
      font-size: 1.6rem;
      color: #2c3e50;
      font-family: "Roboto Mono", sans-serif;
      box-shadow: 1px 5px 9px rgba(211, 211, 211, .7);
      transition: border-color 0.3s ease;
    }

    input::placeholder {
      color: #95a5a6;
    }

    input:focus {
      outline: none;
      border-color: #861400;
    }

    input.error {
      border-color: #e74c3c;
    }

    .error-message {
      color: #e74c3c;
      font-size: 1.4rem;
      margin-top: 0.5rem;
    }

    .login_btn {
      font-size: 1.8rem;
      color: #fbeae7;
      background-color: #861400;
      border-radius: 1.5rem;
      border: none;
      width: 100%;
      padding: 1.4rem;
      margin-top: 2rem;
      box-shadow: 1px 5px 9px rgba(211, 211, 211, .9);
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    .login_btn:hover:not(:disabled) {
      background-color: #6d1000;
    }

    .login_btn:disabled {
      background-color: #d5d5d5;
      cursor: not-allowed;
    }

    .form-footer {
      text-align: center;
      margin-top: 2rem;
      font-size: 1.6rem;
      color: #861400;
    }

    .signup-link {
      color: #861400;
      text-decoration: none;
      font-weight: 600;
      margin-left: 0.5rem;
      transition: color 0.3s ease;
    }

    .signup-link:hover {
      color: #6d1000;
    }
  `]
})
export class StudentSignupComponent {
  studentData: SignupData = {
    name: '',
    email: '',
    phone: '',
    password: ''
  };
  confirmPassword = '';

  constructor(
    private authService: StudentAuthService,
    private router: Router
  ) {}

  onPhoneInput(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/\D/g, '').slice(0, 10);
    this.studentData.phone = input.value;
  }

  onSubmit(form: NgForm) {
    if (form.valid && this.studentData.password === this.confirmPassword) {
      this.authService.signup(this.studentData).subscribe({
        next: (response: AuthResponse) => {
          console.log('Signup successful', response);
          this.router.navigate(['/students/dashboard']);
        },
        error: (error: Error) => {
          console.error('Signup failed', error);
          // Handle error (show message to user)
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/account']);
  }
}
