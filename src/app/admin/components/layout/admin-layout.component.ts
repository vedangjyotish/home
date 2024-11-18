import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-layout">
      <nav class="admin-sidebar">
        <div class="sidebar-header">
          <h1>Admin Panel</h1>
        </div>
        <ul class="nav-links">
          <li>
            <a routerLink="./dashboard" routerLinkActive="active">
              <span class="icon">📊</span>
              Dashboard
            </a>
          </li>
          <li>
            <a routerLink="./users" routerLinkActive="active">
              <span class="icon">👥</span>
              Users
            </a>
          </li>
          <li>
            <a routerLink="./settings" routerLinkActive="active">
              <span class="icon">⚙️</span>
              Settings
            </a>
          </li>
        </ul>
      </nav>

      <main class="admin-main">
        <header class="admin-header">
          <div class="user-info">
            <span class="welcome-text">Welcome, Admin</span>
          </div>
          <div class="header-actions">
            <button class="btn-icon" (click)="logout()">Logout</button>
          </div>
        </header>

        <div class="admin-content">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .admin-layout {
      display: grid;
      grid-template-columns: 250px 1fr;
      min-height: 100vh;
      background-color: #f8f9fa;
    }

    .admin-sidebar {
      background-color: #2c3e50;
      color: white;
      padding: 1rem;
    }

    .sidebar-header {
      padding: 1rem;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }

    .sidebar-header h1 {
      margin: 0;
      font-size: 2.4rem;  
      color: white;
    }

    .nav-links {
      list-style: none;
      padding: 0;
      margin: 1rem 0;
    }

    .nav-links li {
      margin-bottom: 0.5rem;
    }

    .nav-links a {
      display: flex;
      align-items: center;
      padding: 1.2rem 1.6rem;  
      color: #ecf0f1;
      text-decoration: none;
      border-radius: 4px;
      transition: background-color 0.3s;
      font-size: 1.6rem;  
    }

    .nav-links a:hover {
      background-color: rgba(255,255,255,0.1);
    }

    .nav-links a.active {
      background-color: #3498db;
      color: white;
    }

    .icon {
      margin-right: 1.2rem;  
      font-size: 2rem;  
    }

    .admin-main {
      display: flex;
      flex-direction: column;
    }

    .admin-header {
      background-color: white;
      padding: 1.6rem 2.4rem;  
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .welcome-text {
      font-size: 1.8rem;  
      color: #2c3e50;
    }

    .header-actions {
      display: flex;
      gap: 1rem;
    }

    .btn-icon {
      padding: 1rem 1.6rem;  
      border: none;
      border-radius: 4px;
      cursor: pointer;
      background-color: #e74c3c;
      color: white;
      transition: background-color 0.3s;
      font-size: 1.4rem;  
    }

    .btn-icon:hover {
      background-color: #c0392b;
    }

    .admin-content {
      padding: 2.4rem;  
    }
  `]
})
export class AdminLayoutComponent {
  logout() {
    // Implement logout logic
    console.log('Logging out...');
  }
}
