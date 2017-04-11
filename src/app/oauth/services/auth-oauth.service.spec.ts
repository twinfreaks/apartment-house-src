/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AuthOauthService } from './auth-oauth.service';

describe('AuthOauthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthOauthService]
    });
  });

  it('should ...', inject([AuthOauthService], (service: AuthOauthService) => {
    expect(service).toBeTruthy();
  }));
});
