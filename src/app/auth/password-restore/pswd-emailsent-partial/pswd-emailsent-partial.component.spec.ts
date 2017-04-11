/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PswdEmailsentPartialComponent } from './pswd-emailsent-partial.component';

describe('PswdEmailsentPartialComponent', () => {
  let component: PswdEmailsentPartialComponent,
      fixture: ComponentFixture<PswdEmailsentPartialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PswdEmailsentPartialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PswdEmailsentPartialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
