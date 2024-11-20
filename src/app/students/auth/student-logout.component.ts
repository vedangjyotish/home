import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StudentAuthService } from './student-auth.service';

@Component({
  selector: 'app-student-logout',
  standalone: true,
  template: '<div>Logging out...</div>'
})
export class StudentLogoutComponent implements OnInit {
  constructor(
    private authService: StudentAuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
