import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminStateService } from '../../services/admin-state.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <h2>Dashboard Overview</h2>
      <div class="stats-grid">
        <div class="stat-card" routerLink="/admin/students">
          <div class="stat-icon">👥</div>
          <h3>Students</h3>
          <p class="stat-value">1,234</p>
          <p class="stat-label">Total Registered Students</p>
        </div>
        <div class="stat-card" routerLink="/admin/courses">
          <div class="stat-icon">📚</div>
          <h3>Courses</h3>
          <p class="stat-value">24</p>
          <p class="stat-label">Active Courses</p>
        </div>
        <div class="stat-card">
          <div class="stat-icon">💰</div>
          <h3>Revenue</h3>
          <p class="stat-value">₹2.4L</p>
          <p class="stat-label">Total Revenue</p>
        </div>
      </div>

      <div class="quick-actions">
        <h3>Quick Actions</h3>
        <div class="action-grid">
          <button class="action-btn" routerLink="/admin/students">
            Manage Students
          </button>
          <button class="action-btn" routerLink="/admin/courses">
            Manage Courses
          </button>
          <button class="action-btn" routerLink="/admin/payments">
            View Payments
          </button>
          <button class="action-btn" routerLink="/admin/settings">
            Settings
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    h2 {
      font-size: 2.4rem;
      color: #333;
      margin-bottom: 2rem;
      font-weight: 600;
    }

    h3 {
      font-size: 1.8rem;
      color: #444;
      margin: 1rem 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .stat-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: transform 0.2s, box-shadow 0.2s;
      cursor: pointer;
      text-align: center;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    .stat-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .stat-value {
      font-size: 2.8rem;
      font-weight: bold;
      color: #dc3545;
      margin: 1rem 0;
    }

    .stat-label {
      color: #666;
      font-size: 1.4rem;
    }

    .quick-actions {
      margin-top: 3rem;
    }

    .action-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-top: 1.5rem;
    }

    .action-btn {
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      padding: 1.2rem;
      border-radius: 6px;
      font-size: 1.4rem;
      color: #444;
      cursor: pointer;
      transition: all 0.2s;
    }

    .action-btn:hover {
      background: #dc3545;
      color: white;
      border-color: #dc3545;
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 1.5rem;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .stat-value {
        font-size: 2.4rem;
      }
    }
  `]
})
export class AdminDashboardComponent {
  constructor(private adminState: AdminStateService) {}
}
