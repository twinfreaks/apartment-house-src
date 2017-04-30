import { TestBed, inject } from '@angular/core/testing';

import { UserLogsService } from './user-logs.service';

describe('UserLogsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserLogsService]
    });
  });

  it('should ...', inject([UserLogsService], (service: UserLogsService) => {
    expect(service).toBeTruthy();
  }));
});
