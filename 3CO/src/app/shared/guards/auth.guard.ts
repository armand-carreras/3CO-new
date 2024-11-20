import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
    // Reconstruct the current URL from route.url
    const currentUrl = state.url;
    console.log('-------0 State:', JSON.stringify(state.url));
    console.log('-------0 Route:', route.toString());

    // Check if the user is already in /tabs
    if (currentUrl.startsWith('/tabs')) {
      // Prevent navigation to /auth by returning false
      return false;
    }
  
    // Allow navigation if not in /tabs
    return true;
  };
