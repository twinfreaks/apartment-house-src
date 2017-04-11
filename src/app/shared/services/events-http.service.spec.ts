/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { EventsHttpService } from './events-http.service';

describe('EventsHttpService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EventsHttpService]
    });
  });

  it('should ...', inject([EventsHttpService], (service: EventsHttpService) => {
    expect(service).toBeTruthy();
  }));
});
