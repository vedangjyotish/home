import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account.component';
import { HttpClientModule } from '@angular/common/http';

const routes: Routes = [
  { path: '', component: AccountComponent }
];

@NgModule({
  declarations: [
    AccountComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forChild(routes)
  ]
})
export class AccountModule { }
