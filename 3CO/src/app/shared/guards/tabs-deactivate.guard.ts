import { CanActivateChildFn } from '@angular/router';

export const tabsDeactivateGuard: CanActivateChildFn = (childRoute, state) => {
  if(!childRoute) {
    return false;
  }
  return true;
};
