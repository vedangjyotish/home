import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../core/services/token-storage.service';

@Component({
  selector: 'app-member-dashboard',
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Welcome, {{ memberName }}</h1>
        <button class="logout-btn" (click)="logout()">Logout</button>
      </div>
      
      <div class="dashboard-content">
        <div class="stats-container">
          <div class="stat-card">
            <h3>Total Sessions</h3>
            <p class="stat-number">0</p>
          </div>
          <div class="stat-card">
            <h3>Active Students</h3>
            <p class="stat-number">0</p>
          </div>
          <div class="stat-card">
            <h3>Rating</h3>
            <p class="stat-number">N/A</p>
          </div>
        </div>

        <div class="recent-activity">
          <h2>Recent Activity</h2>
          <p *ngIf="!hasActivity" class="no-activity">No recent activity</p>
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

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 3rem;
    }

    h1 {
      font-size: 2.8rem;
      color: #2c3e50;
      margin: 0;
    }

    .logout-btn {
      padding: 1rem 2rem;
      background-color: #e74c3c;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1.6rem;
      transition: background-color 0.3s;
    }

    .logout-btn:hover {
      background-color: #c0392b;
    }

    .stats-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .stat-card {
      background-color: #f8f9fa;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      text-align: center;
    }

    .stat-card h3 {
      font-size: 1.8rem;
      color: #2c3e50;
      margin-bottom: 1rem;
    }

    .stat-number {
      font-size: 3.2rem;
      font-weight: bold;
      color: #e74c3c;
      margin: 0;
    }

    .recent-activity {
      background-color: #f8f9fa;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .recent-activity h2 {
      font-size: 2.4rem;
      color: #2c3e50;
      margin-bottom: 2rem;
    }

    .no-activity {
      text-align: center;
      color: #7f8c8d;
      font-size: 1.6rem;
    }
  `]
})
export class MemberDashboardComponent implements OnInit {
  memberName: string = '';
  hasActivity: boolean = false;

  constructor(
    private tokenStorage: TokenStorageService,
    private router: Router
  ) {}

  ngOnInit() {
    const user = this.tokenStorage.getUser();
    this.memberName = user?.name || 'Member';
  }

  logout() {
    this.tokenStorage.signOut();
    this.router.navigate(['/account']);
  }
}
