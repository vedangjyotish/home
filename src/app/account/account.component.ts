import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentAuthService } from '../students/auth/student-auth.service';
import { MemberAuthService } from '../members/auth/member-auth.service';
import { TokenStorageService } from '../core/services/token-storage.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
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

  ngOnInit(): void {
    // Check if user is already logged in
    if (this.tokenStorage.getToken()) {
      const user = this.tokenStorage.getUser();
      if (user) {
        this.redirectBasedOnUserType(user.type);
      }
    }
  }

  private redirectBasedOnUserType(userType: string): void {
    switch (userType) {
      case 'student':
        this.router.navigate(['/students/dashboard']);
        break;
      case 'member':
        this.router.navigate(['/members/dashboard']);
        break;
      default:
        // Handle unknown user type
        console.error('Unknown user type:', userType);
    }
  }

  showStudentLogin(): void {
    this.showStudentForm = true;
    this.showMemberForm = false;
    this.clearMessages();
  }

  showMemberLogin(): void {
    this.showMemberForm = true;
    this.showStudentForm = false;
    this.clearMessages();
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  onStudentIdInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.studentId = input.value;
  }

  onMemberIdInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.memberId = input.value;
  }

  onStudentSubmit(): void {
    if (!this.studentId || !this.studentPassword) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    this.studentAuth.login(this.studentId, this.studentPassword).subscribe({
      next: (response) => {
        this.successMessage = 'Login successful!';
        this.errorMessage = '';
        // Add a delay before redirecting
        setTimeout(() => {
          this.router.navigate(['/students/dashboard']);
        }, 1000); // 1 second delay
      },
      error: (error) => {
        this.errorMessage = error;
        this.successMessage = '';
      }
    });
  }

  onMemberSubmit(): void {
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
        this.errorMessage = error;
        this.successMessage = '';
      }
    });
  }

  goBack(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    this.showStudentForm = false;
    this.showMemberForm = false;
    this.clearMessages();
    this.router.navigate(['/account']);
  }
}
