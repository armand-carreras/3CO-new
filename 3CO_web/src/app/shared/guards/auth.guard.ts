import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Example service to check authentication
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn) { // Replace with your actual login check logic
    // Redirect to the default tabs route
    router.navigate(['/tabs']);
    return false;
  }

  return true;
};
