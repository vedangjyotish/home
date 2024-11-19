import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MemberSignupComponent } from './auth/member-signup.component';
import { HttpClientModule } from '@angular/common/http';
import { MemberAuthService } from './auth/member-auth.service';

const routes: Routes = [
  { path: 'signup', component: MemberSignupComponent }
];

@NgModule({
  declarations: [
    MemberSignupComponent
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
