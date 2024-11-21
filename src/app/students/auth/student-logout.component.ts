import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StudentAuthService } from './student-auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-logout',
  standalone: true,
  imports: [CommonModule],
  template: '<div class="text-center p-4">Logging out...</div>'
})
export class StudentLogoutComponent implements OnInit {
  constructor(
    private authService: StudentAuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // The actual navigation will be handled by the auth service
    this.authService.logout();
    this.router.navigate(['/account']);
  }
}
