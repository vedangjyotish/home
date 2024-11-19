import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

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
  
  // Student login form
  studentId = '';
  studentPassword = '';

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

  onMemberSubmit() {
    // TODO: Implement member login logic
    console.log('Member login:', { phone: this.memberPhone, password: this.memberPassword });
  }

  onStudentSubmit() {
    // TODO: Implement student login logic
    console.log('Student login:', { id: this.studentId, password: this.studentPassword });
  }
}
