import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TokenStorageService } from '../services/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private tokenStorage: TokenStorageService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.tokenStorage.isLoggedIn()) {
      // If coming from cart, redirect to checkout auth
      if (state.url.includes('payment-upload')) {
        this.router.navigate(['/cart/checkout-auth']);
      } else {
        this.router.navigate(['/account']);
      }
      return false;
    }

    // Check if route requires specific user type
    const requiredUserType = route.data['userType'] as 'student' | 'member';
    if (requiredUserType) {
      const userType = this.tokenStorage.getUserType();
      if (userType !== requiredUserType) {
        // If coming from cart, redirect to checkout auth
        if (state.url.includes('payment-upload')) {
          this.router.navigate(['/cart/checkout-auth']);
        } else {
          this.router.navigate(['/account']);
        }
        return false;
      }
    }

    return true;
  }
}
