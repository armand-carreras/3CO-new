import { CanDeactivateFn } from '@angular/router';

export const tabsDeactivateGuard: CanDeactivateFn<any> = (component, currentRoute, currentState, nextState) => {
  // Allow navigation if moving away from /tabs
  if (nextState?.url && !nextState.url.startsWith('/tabs')) {
    return true;
  }

  // Block navigation if no valid route is provided
  return currentState && nextState ? false : true;
};
