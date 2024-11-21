import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AdminAuthService } from '../../services/admin-auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent {
  constructor(
    private authService: AdminAuthService,
    private router: Router
  ) {}

  logout(): void {
    this.router.navigate(['/admin/login']).then(() => {
      this.authService.logout().subscribe({
        next: () => {
          // Successfully logged out and redirected
        },
        error: (error) => {
          // Handle error silently or show user notification if needed
        }
      });
    });
  }
}