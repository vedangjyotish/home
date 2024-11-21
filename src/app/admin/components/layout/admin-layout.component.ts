import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminAuthService } from '../../services/admin-auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements AfterViewInit {
  constructor(
    private authService: AdminAuthService,
    private elementRef: ElementRef
  ) {}

  ngAfterViewInit() {
    // Debug: Log the nav links
    const navLinks = this.elementRef.nativeElement.querySelector('.nav-links');
    console.log('Nav Links Element:', navLinks);
    console.log('Nav Links HTML:', navLinks.innerHTML);
    
    // Specifically check the students link
    const studentsLink = navLinks.querySelector('a[routerLink="students"]');
    console.log('Students Link:', studentsLink);
    console.log('Students Link Text:', studentsLink?.textContent);
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        console.log('Logged out successfully');
      },
      error: (error) => {
        console.error('Logout error:', error);
      }
    });
  }
}