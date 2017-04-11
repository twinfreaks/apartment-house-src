/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from "@angular/core/testing";
import { InhabitantsService } from "./inhabitants.service";

describe('InhabitantsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InhabitantsService]
    });
  });

  it('should ...', inject([InhabitantsService], (service: InhabitantsService) => {
    expect(service).toBeTruthy();
  }));
});
