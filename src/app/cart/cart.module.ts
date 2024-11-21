import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CartComponent } from './cart.component';
import { CheckoutAuthComponent } from './checkout-auth/checkout-auth.component';
import { CartRoutingModule } from './cart-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CartRoutingModule,
    CartComponent,
    CheckoutAuthComponent
  ]
})
export class CartModule {
  constructor() {
    console.log('CartModule loaded');
  }
}
