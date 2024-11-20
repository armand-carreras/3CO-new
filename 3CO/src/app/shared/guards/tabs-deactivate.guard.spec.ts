import { TestBed } from '@angular/core/testing';
import { CanActivateChildFn } from '@angular/router';

import { tabsDeactivateGuard } from './tabs-deactivate.guard';

describe('tabsDeactivateGuard', () => {
  const executeGuard: CanActivateChildFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => tabsDeactivateGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
