/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RestorePasswordService } from './restore-password.service';

describe('RestorePasswordService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RestorePasswordService]
    });
  });

  it('should ...', inject([RestorePasswordService], (service: RestorePasswordService) => {
    expect(service).toBeTruthy();
  }));
});
