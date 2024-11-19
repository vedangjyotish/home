import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentAuthService } from '../students/auth/student-auth.service';
import { MemberAuthService } from '../members/auth/member-auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {
  showStudentForm = false;
  showMemberForm = false;
  studentId = '';
  studentPassword = '';
  memberId = '';
  memberPassword = '';

  constructor(
    private router: Router,
    private studentAuth: StudentAuthService,
    private memberAuth: MemberAuthService
  ) {}

  showStudentLogin() {
    this.showStudentForm = true;
    this.showMemberForm = false;
  }

  showMemberLogin() {
    this.showMemberForm = true;
    this.showStudentForm = false;
  }

  onStudentIdInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    
    // If the input is numeric, limit to 10 digits
    if (/^\d+$/.test(value)) {
      input.value = value.slice(0, 10);
      this.studentId = input.value;
    } else {
      // If it's not numeric (email), don't apply the 10-digit limit
      this.studentId = value;
    }
  }

  onMemberIdInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    
    // Only allow digits and limit to 10
    if (/^\d*$/.test(value)) {
      input.value = value.slice(0, 10);
      this.memberId = input.value;
    }
  }

  isValidStudentId(id: string): boolean {
    // Check if it's a valid email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(id)) {
      return true;
    }

    // Check if it's a 10-digit number
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(id);
  }

  isValidMemberId(id: string): boolean {
    // Check if it's exactly 10 digits
    return /^\d{10}$/.test(id);
  }

  onStudentSubmit() {
    if (this.isValidStudentId(this.studentId) && this.studentPassword.length >= 8) {
      this.studentAuth.login({ id: this.studentId, password: this.studentPassword })
        .subscribe({
          next: (response) => {
            console.log('Student login successful', response);
            // Handle successful login (e.g., store token, redirect)
            this.router.navigate(['/students/dashboard']);
          },
          error: (error) => {
            console.error('Student login failed', error);
            // Handle login error (show message to user)
          }
        });
    }
  }

  onMemberSubmit() {
    if (this.isValidMemberId(this.memberId) && this.memberPassword.length >= 8) {
      this.memberAuth.login({ phone: this.memberId, password: this.memberPassword })
        .subscribe({
          next: (response) => {
            console.log('Member login successful', response);
            // Handle successful login (e.g., store token, redirect)
            this.router.navigate(['/members/dashboard']);
          },
          error: (error) => {
            console.error('Member login failed', error);
            // Handle login error (show message to user)
          }
        });
    }
  }

  goBack(event?: Event) {
    if (event) {
      event.preventDefault();
    }
    this.showStudentForm = false;
    this.showMemberForm = false;
    this.router.navigate(['/account']);
  }
}
