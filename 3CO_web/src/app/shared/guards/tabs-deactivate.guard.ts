import { CanDeactivateFn } from '@angular/router';

export const tabsDeactivateGuard: CanDeactivateFn<any> = (component, currentRoute, currentState, nextState) => {
 
  // Handle undefined `nextState` (e.g., back button)
  if (!nextState?.url) {
    console.log('Back button detected, blocking deactivation');
    return false;
  }

  const movingToLogout = nextState.url.includes('logout');
  const movingToRegister = nextState.url.endsWith('/register');

  if (movingToLogout || movingToRegister) {
    return true; // Allow deactivation for these specific cases
  }

  console.log('Deactivation blocked for route:', nextState.url);
  return false; // Block deactivation for all other cases
}
