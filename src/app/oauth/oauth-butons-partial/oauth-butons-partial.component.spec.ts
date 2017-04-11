/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { OauthButonsPartialComponent } from './oauth-butons-partial.component';

describe('OauthButonsPartialComponent', () => {
  let component: OauthButonsPartialComponent,
      fixture: ComponentFixture<OauthButonsPartialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OauthButonsPartialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OauthButonsPartialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
