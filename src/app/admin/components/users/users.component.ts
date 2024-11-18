import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin.service';
import { AdminStateService } from '../../services/admin-state.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="users-container">
      <header class="users-header">
        <h2>User Management</h2>
        <button class="btn-primary" (click)="addUser()">Add User</button>
      </header>

      <div class="users-table-container">
        <table class="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of users()">
              <td>{{user.id}}</td>
              <td>{{user.name}}</td>
              <td>{{user.email}}</td>
              <td>{{user.role}}</td>
              <td>
                <span class="status-badge" [class.active]="user.active">
                  {{user.active ? 'Active' : 'Inactive'}}
                </span>
              </td>
              <td class="actions">
                <button class="btn-icon" (click)="editUser(user)">Edit</button>
                <button class="btn-icon delete" (click)="deleteUser(user.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .users-container {
      padding: 2rem;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .users-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2.4rem;
    }

    .users-header h2 {
      color: #2c3e50;
      margin: 0;
      font-size: 2.2rem;
    }

    .btn-primary {
      background-color: #3498db;
      color: white;
      border: none;
      padding: 1rem 1.6rem;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s;
      font-size: 1.4rem;
    }

    .btn-primary:hover {
      background-color: #2980b9;
    }

    .users-table-container {
      overflow-x: auto;
    }

    .users-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1.6rem;
      font-size: 1.4rem;
    }

    .users-table th,
    .users-table td {
      padding: 1.2rem 1.6rem;
      text-align: left;
      border-bottom: 1px solid #ecf0f1;
    }

    .users-table th {
      background-color: #f8f9fa;
      color: #2c3e50;
      font-weight: 600;
      font-size: 1.5rem;
    }

    .users-table tr:hover {
      background-color: #f8f9fa;
    }

    .status-badge {
      padding: 0.6rem 1.2rem;
      border-radius: 12px;
      font-size: 1.3rem;
      background-color: #e74c3c;
      color: white;
    }

    .status-badge.active {
      background-color: #2ecc71;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
    }

    .btn-icon {
      padding: 0.8rem 1.2rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      background-color: #3498db;
      color: white;
      transition: background-color 0.3s;
      font-size: 1.4rem;
    }

    .btn-icon:hover {
      background-color: #2980b9;
    }

    .btn-icon.delete {
      background-color: #e74c3c;
    }

    .btn-icon.delete:hover {
      background-color: #c0392b;
    }
  `]
})
export class UsersComponent {
  private adminService = inject(AdminService);
  private adminState = inject(AdminStateService);

  users = signal<any[]>([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', active: true },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', active: true },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', active: false },
  ]);

  constructor() {
    this.loadUsers();
  }

  private loadUsers() {
    this.adminService.getUsers().subscribe({
      next: (data) => this.users.set(data),
      error: (error) => this.adminState.setError('Failed to load users')
    });
  }

  addUser() {
    // Implement user addition logic
  }

  editUser(user: any) {
    // Implement user edit logic
  }

  deleteUser(userId: string) {
    this.adminService.deleteUser(userId).subscribe({
      next: () => {
        this.users.update(users => users.filter(u => u.id !== userId));
        this.adminState.addNotification({ type: 'success', message: 'User deleted successfully' });
      },
      error: (error) => this.adminState.setError('Failed to delete user')
    });
  }
}
