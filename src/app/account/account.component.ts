import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentAuthService } from '../students/auth/student-auth.service';
import { MemberAuthService } from '../members/auth/member-auth.service';
import { TokenStorageService } from '../core/services/token-storage.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  showStudentForm = false;
  showMemberForm = false;
  studentId = '';
  studentPassword = '';
  memberId = '';
  memberPassword = '';
  errorMessage = '';
  successMessage = '';

  constructor(
    private router: Router,
    private studentAuth: StudentAuthService,
    private memberAuth: MemberAuthService,
    private tokenStorage: TokenStorageService
  ) {}

  ngOnInit() {
    // Check if user is already logged in
    const user = this.tokenStorage.getUser();
    if (user) {
      this.redirectBasedOnUserType(user.type);
    }
  }

  private redirectBasedOnUserType(userType: string) {
    switch (userType) {
      case 'student':
        this.router.navigate(['/students/dashboard']);
        break;
      case 'member':
        this.router.navigate(['/members/dashboard']);
        break;
      default:
        // Handle unknown user type
        this.tokenStorage.signOut();
        this.errorMessage = 'Invalid user type';
    }
  }

  showStudentLogin() {
    this.showStudentForm = true;
    this.showMemberForm = false;
    this.clearMessages();
  }

  showMemberLogin() {
    this.showMemberForm = true;
    this.showStudentForm = false;
    this.clearMessages();
  }

  clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }

  onStudentIdInput(event: Event) {
    const input = event.target as HTMLInputElement;
    // Allow both email and phone number input
    this.studentId = input.value;
  }

  onMemberIdInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    
    // If the input is numeric, limit to 10 digits
    if (/^\d+$/.test(value)) {
      input.value = value.slice(0, 10);
      this.memberId = input.value;
    } else {
      // If non-numeric, remove non-numeric characters
      input.value = value.replace(/\D/g, '');
      this.memberId = input.value;
    }
  }

  onStudentSubmit() {
    if (!this.studentId || !this.studentPassword) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    this.studentAuth.login({ id: this.studentId, password: this.studentPassword }).subscribe({
      next: (response) => {
        this.successMessage = 'Login successful!';
        this.errorMessage = '';
        // Add a delay before redirecting
        setTimeout(() => {
          this.router.navigate(['/students/dashboard']);
        }, 1000); // 1 second delay
      },
      error: (error) => {
        this.errorMessage = error.message || 'Login failed';
        this.successMessage = '';
      }
    });
  }

  onMemberSubmit() {
    if (!this.memberId || !this.memberPassword) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    this.memberAuth.login({ phone: this.memberId, password: this.memberPassword }).subscribe({
      next: (response) => {
        this.successMessage = 'Login successful!';
        this.errorMessage = '';
        // Add a delay before redirecting
        setTimeout(() => {
          this.router.navigate(['/members/dashboard']);
        }, 1000); // 1 second delay
      },
      error: (error) => {
        this.errorMessage = error.message || 'Login failed';
        this.successMessage = '';
      }
    });
  }

  goBack(event?: Event) {
    if (event) {
      event.preventDefault();
    }
    this.showStudentForm = false;
    this.showMemberForm = false;
    this.clearMessages();
    this.router.navigate(['/account']);
  }
}
