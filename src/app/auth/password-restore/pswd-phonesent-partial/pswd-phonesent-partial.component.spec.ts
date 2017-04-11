/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PswdPhonesentPartialComponent } from './pswd-phonesent-partial.component';

describe('PswdPhonesentPartialComponent', () => {
  let component: PswdPhonesentPartialComponent,
      fixture: ComponentFixture<PswdPhonesentPartialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PswdPhonesentPartialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PswdPhonesentPartialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
