import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './components/layout/admin-layout.component';
import { AdminUsersComponent } from './components/users/users.component';
import { AdminSettingsComponent } from './components/settings/settings.component';
import { AdminCoursesComponent } from './components/courses/courses.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: 'users', component: AdminUsersComponent },
      { path: 'settings', component: AdminSettingsComponent },
      { path: 'courses', component: AdminCoursesComponent },
      { path: '', redirectTo: 'users', pathMatch: 'full' }
    ]
  }
];
