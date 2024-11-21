import { Component, OnInit } from '@angular/core';
import { StudentAuthService } from '../auth/student-auth.service';

@Component({
  selector: 'app-student-logout',
  template: '' // Empty template as this is just a logout handler
})
export class StudentLogoutComponent implements OnInit {
  constructor(private authService: StudentAuthService) {}

  ngOnInit() {
    this.authService.logout();
  }
}
