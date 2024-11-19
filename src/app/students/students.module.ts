import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { StudentSignupComponent } from './auth/student-signup.component';
import { StudentDashboardComponent } from './dashboard/student-dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { StudentAuthService } from './auth/student-auth.service';
import { AuthGuard } from '../core/guards/auth.guard';

const routes: Routes = [
  { path: 'signup', component: StudentSignupComponent },
  { 
    path: 'dashboard', 
    component: StudentDashboardComponent,
    canActivate: [AuthGuard],
    data: { userType: 'student' }
  }
];

@NgModule({
  declarations: [
    StudentSignupComponent,
    StudentDashboardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    StudentAuthService
  ]
})
export class StudentsModule { }
