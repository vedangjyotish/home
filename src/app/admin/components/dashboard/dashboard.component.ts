import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminStateService } from '../../services/admin-state.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <h2>Dashboard</h2>
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Total Users</h3>
          <p class="stat-value">1,234</p>
        </div>
        <div class="stat-card">
          <h3>Active Users</h3>
          <p class="stat-value">892</p>
        </div>
        <div class="stat-card">
          <h3>New Today</h3>
          <p class="stat-value">48</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    h2 {
      margin: 0 0 2rem 0;
      font-size: 2.4rem;
      color: #2c3e50;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }

    .stat-card {
      background-color: #f8f9fa;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .stat-card h3 {
      margin: 0;
      font-size: 1.6rem;
      color: #7f8c8d;
    }

    .stat-value {
      margin: 1rem 0 0 0;
      font-size: 3.2rem;
      font-weight: bold;
      color: #2c3e50;
    }
  `]
})
export class AdminDashboardComponent {
  private adminState = inject(AdminStateService);
}
