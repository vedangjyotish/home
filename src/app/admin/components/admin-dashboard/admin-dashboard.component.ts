import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="bg-white p-4 rounded shadow">
          <h2 class="text-lg font-semibold mb-2">Students</h2>
          <p class="text-gray-600">Manage registered users</p>
        </div>
        <div class="bg-white p-4 rounded shadow">
          <h2 class="text-lg font-semibold mb-2">Courses</h2>
          <p class="text-gray-600">Manage course content</p>
        </div>
        <div class="bg-white p-4 rounded shadow">
          <h2 class="text-lg font-semibold mb-2">Settings</h2>
          <p class="text-gray-600">Configure system settings</p>
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent {}
