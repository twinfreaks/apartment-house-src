/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LanguageTranslateService } from './language-translate.service';

describe('LanguageTranslateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LanguageTranslateService]
    });
  });

  it('should ...', inject([LanguageTranslateService], (service: LanguageTranslateService) => {
    expect(service).toBeTruthy();
  }));
});
