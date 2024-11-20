import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-enrollment-success',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './enrollment-success.component.html',
  styleUrls: ['./enrollment-success.component.css']
})
export class EnrollmentSuccessComponent {
  constructor(private router: Router) {}

  goToDashboard() {
    // Update path to match the students module route
    this.router.navigate(['/students/dashboard']);
  }

  goToCourses() {
    this.router.navigate(['/courses']);
  }
}
