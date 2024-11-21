import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { StudentAuthService } from '../../students/auth/student-auth.service';
import { TokenStorageService } from '../../core/services/token-storage.service';

@Component({
  selector: 'app-checkout-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './checkout-auth.component.html',
  styleUrls: ['./checkout-auth.component.css']
})
export class CheckoutAuthComponent implements OnInit {
  isLoginMode = signal(true);
  errorMessage = signal('');
  loading = signal(false);

  loginForm = {
    identifier: '',
    password: ''
  };

  signupForm = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  };

  constructor(
    private authService: StudentAuthService,
    private tokenStorage: TokenStorageService,
    private router: Router
  ) {
    console.log('CheckoutAuthComponent constructed');
  }

  ngOnInit(): void {
    console.log('CheckoutAuthComponent initialized');
    // If user is already logged in, redirect back to cart
    if (this.authService.isLoggedIn()) {
      console.log('User already logged in, redirecting to cart');
      this.router.navigate(['/cart']);
      return;
    }
  }

  toggleMode() {
    console.log('Toggling auth mode');
    this.isLoginMode.update(v => !v);
    this.errorMessage.set('');
  }

  onLogin() {
    console.log('Login attempt with:', this.loginForm.identifier);
    this.loading.set(true);
    this.errorMessage.set('');

    this.authService.login(this.loginForm.identifier, this.loginForm.password).subscribe({
      next: (response) => {
        if (response.access_token) {
          this.loading.set(false);
          // After successful login, always go to payment upload
          this.router.navigate(['/payment-upload']);
        }
      },
      error: (error) => {
        console.error('Login error:', error);
        this.loading.set(false);
        this.errorMessage.set(error);
      }
    });
  }

  onSignup() {
    if (this.signupForm.password !== this.signupForm.confirmPassword) {
      this.errorMessage.set('Passwords do not match');
      return;
    }

    console.log('Signup attempt with:', this.signupForm.email);
    this.loading.set(true);
    this.errorMessage.set('');

    const signupData = {
      firstName: this.signupForm.firstName,
      lastName: this.signupForm.lastName,
      email: this.signupForm.email,
      phone: this.signupForm.phone,
      password: this.signupForm.password
    };

    this.authService.signup(signupData).subscribe({
      next: (response) => {
        if (response.access_token) {
          this.loading.set(false);
          // After successful signup, go to payment upload
          this.router.navigate(['/payment-upload']);
        }
      },
      error: (error) => {
        console.error('Signup error:', error);
        this.loading.set(false);
        this.errorMessage.set(error);
      }
    });
  }
}
