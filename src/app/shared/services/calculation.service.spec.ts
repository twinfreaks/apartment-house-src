/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CalculationService } from './calculation.service';

describe('CalculationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CalculationService]
    });
  });

  it('should ...', inject([CalculationService], (service: CalculationService) => {
    expect(service).toBeTruthy();
  }));
});
