import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MemberSignupComponent } from './auth/member-signup.component';
import { MemberDashboardComponent } from './dashboard/member-dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { MemberAuthService } from './auth/member-auth.service';
import { AuthGuard } from '../core/guards/auth.guard';

const routes: Routes = [
  { path: 'signup', component: MemberSignupComponent },
  { 
    path: 'dashboard', 
    component: MemberDashboardComponent,
    canActivate: [AuthGuard],
    data: { userType: 'member' }
  }
];

@NgModule({
  declarations: [
    MemberSignupComponent,
    MemberDashboardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    MemberAuthService
  ]
})
export class MembersModule { }
