import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { StudentSignupComponent } from './auth/student-signup.component';
import { HttpClientModule } from '@angular/common/http';
import { StudentAuthService } from './auth/student-auth.service';

const routes: Routes = [
  { path: 'signup', component: StudentSignupComponent }
];

@NgModule({
  declarations: [
    StudentSignupComponent
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
