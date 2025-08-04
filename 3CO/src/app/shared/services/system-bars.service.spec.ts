import { TestBed } from '@angular/core/testing';

import { SystemBarsService } from './system-bars.service';

describe('SystemBarsService', () => {
  let service: SystemBarsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SystemBarsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
