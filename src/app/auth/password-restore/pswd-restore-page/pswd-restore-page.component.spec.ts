/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PswdRestorePageComponent } from './pswd-restore-page.component';

describe('PswdRestorePageComponent', () => {
  let component: PswdRestorePageComponent,
      fixture: ComponentFixture<PswdRestorePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PswdRestorePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PswdRestorePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
