import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from './cart.component';
import { CheckoutAuthComponent } from './checkout-auth/checkout-auth.component';

const routes: Routes = [
  {
    path: '',
    component: CartComponent
  },
  {
    path: 'checkout-auth',
    component: CheckoutAuthComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CartRoutingModule {
  constructor() {
    console.log('CartRoutingModule loaded with routes:', routes);
  }
}
