/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PswdRestoreEmailPartialComponent } from './pswd-restore-email-partial.component';

describe('PswdRestoreEmailPartialComponent', () => {
  let component: PswdRestoreEmailPartialComponent,
      fixture: ComponentFixture<PswdRestoreEmailPartialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PswdRestoreEmailPartialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PswdRestoreEmailPartialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
