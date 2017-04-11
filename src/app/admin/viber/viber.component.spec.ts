/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ViberComponent } from './viber.component';

describe('ViberComponent', () => {
  let component: ViberComponent,
      fixture: ComponentFixture<ViberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
