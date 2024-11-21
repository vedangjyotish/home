import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './components/layout/admin-layout.component';
import { AdminDashboardComponent } from './components/dashboard/dashboard.component';
import { StudentsComponent } from './components/students';
import { AdminCoursesComponent } from './components/courses/courses.component';
import { AdminSettingsComponent } from './components/settings/settings.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AdminAuthGuard } from './guards/admin-auth.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'login',
    component: AdminLoginComponent
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AdminAuthGuard],
    children: [
      {
        path: 'dashboard',
        component: AdminDashboardComponent
      },
      {
        path: 'students',
        component: StudentsComponent
      },
      {
        path: 'courses',
        component: AdminCoursesComponent
      },
      {
        path: 'settings',
        component: AdminSettingsComponent
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];
