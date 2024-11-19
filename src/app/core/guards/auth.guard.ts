import { inject, PLATFORM_ID } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  
  let isAuthenticated = false;
  
  if (isPlatformBrowser(platformId)) {
    isAuthenticated = localStorage.getItem('student_token') !== null;
  }
  
  if (!isAuthenticated) {
    router.navigate(['/students/auth'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }
  
  return true;
};
