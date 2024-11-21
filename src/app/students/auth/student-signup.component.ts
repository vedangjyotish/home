import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentAuthService } from './student-auth.service';
import { TokenStorageService } from '../../core/services/token-storage.service';

interface SignupData {
  firstName: string;
  lastName: string;
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
  templateUrl: './student-signup.component.html',
  styleUrls: ['./student-signup.component.scss']
})
export class StudentSignupComponent implements OnInit {
  studentData: SignupData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: ''
  };
  confirmPassword = '';
  errorMessage = '';
  isLoading = false;
  fieldErrors: { [key: string]: string } = {};

  constructor(
    private authService: StudentAuthService,
    private router: Router,
    private tokenStorage: TokenStorageService
  ) {}

  ngOnInit(): void {
    // If user is already logged in, redirect to dashboard
    if (this.tokenStorage.getToken()) {
      this.router.navigate(['/students/dashboard']);
    }
  }

  onPhoneInput(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/\D/g, '').slice(0, 10);
    this.studentData.phone = input.value;
  }

  clearErrors() {
    this.errorMessage = '';
    this.fieldErrors = {};
  }

  onSubmit(form: NgForm) {
    if (form.valid && this.studentData.password === this.confirmPassword) {
      this.isLoading = true;
      this.clearErrors();

      this.authService.signup(this.studentData).subscribe({
        next: (response) => {
          // Success message can be shown if needed
          // this.errorMessage = response.message;
          this.router.navigate(['/students/dashboard']);
        },
        error: (error: string) => {
          this.isLoading = false;
          
          // Handle specific error messages
          if (error.includes('already exists')) {
            this.fieldErrors['email'] = 'Email address is already registered';
          } else if (error.includes('required')) {
            const field = error.split(' ')[0];
            this.fieldErrors[field] = `${field} is required`;
          } else {
            this.errorMessage = error;
          }
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/account']);
  }
}
