import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin.service';
import { AdminStateService } from '../../services/admin-state.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class AdminUsersComponent {
  private adminService = inject(AdminService);
  private adminState = inject(AdminStateService);

  users = signal([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'User', active: true },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Admin', active: true },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', active: false }
  ]);

  addUser() {
    // Implement add user logic
    console.log('Adding new user...');
  }

  editUser(user: any) {
    // Implement edit user logic
    console.log('Editing user:', user);
  }

  deleteUser(userId: number) {
    // Implement delete user logic
    console.log('Deleting user:', userId);
  }
}