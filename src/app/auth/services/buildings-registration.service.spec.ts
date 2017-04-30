import { TestBed, inject } from '@angular/core/testing';

import { BuildingsRegistrationService } from './buildings-registration.service';

describe('BuildingsRegistrationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BuildingsRegistrationService]
    });
  });

  it('should ...', inject([BuildingsRegistrationService], (service: BuildingsRegistrationService) => {
    expect(service).toBeTruthy();
  }));
});
