import { TestBed, inject } from '@angular/core/testing';

import { AdministratorsService } from './administrators.service';

describe('AdministratorsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdministratorsService]
    });
  });

  it('should ...', inject([AdministratorsService], (service: AdministratorsService) => {
    expect(service).toBeTruthy();
  }));
});
