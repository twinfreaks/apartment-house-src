import { TestBed, inject } from '@angular/core/testing';

import { EventsOauthService } from './events-oauth.service';

describe('EventsOauthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EventsOauthService]
    });
  });

  it('should ...', inject([EventsOauthService], (service: EventsOauthService) => {
    expect(service).toBeTruthy();
  }));
});
