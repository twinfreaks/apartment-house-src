/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AuthAppService} from './auth-app.service';

describe('AuthAppService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthAppService]
    });
  });

  it('should ...', inject([AuthAppService], (service: AuthAppService) => {
    expect(service).toBeTruthy();
  }));
});
