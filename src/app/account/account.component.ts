import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class AccountComponent {
  showMemberForm = false;
  showStudentForm = false;
  
  // Member login form
  memberPhone = '';
  memberPassword = '';
  memberId = '';
  
  // Student login form
  studentId = '';
  studentPassword = '';

  // Validation patterns
  emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  phonePattern = /^[0-9]{10}$/;

  constructor(private router: Router) {}

  showMemberLogin() {
    this.showMemberForm = true;
    this.showStudentForm = false;
  }

  showStudentLogin() {
    this.showStudentForm = true;
    this.showMemberForm = false;
  }

  hideLoginForms() {
    this.showMemberForm = false;
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
      // Proceed with login
      console.log('Student login submitted:', { id: this.studentId, password: this.studentPassword });
      // Add your login logic here
    }
  }

  onMemberSubmit() {
    if (this.isValidMemberId(this.memberId) && this.memberPassword.length >= 8) {
      // Proceed with login
      console.log('Member login submitted:', { id: this.memberId, password: this.memberPassword });
      // Add your login logic here
    }
  }

  goBack() {
    this.showStudentForm = false;
    this.showMemberForm = false;
  }
}
