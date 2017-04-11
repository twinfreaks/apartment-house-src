/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LangsComponent } from './langs.component';

describe('LangsComponent', () => {
  let component: LangsComponent,
      fixture: ComponentFixture<LangsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LangsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LangsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
