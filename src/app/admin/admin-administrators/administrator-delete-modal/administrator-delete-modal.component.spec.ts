import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministratorDeleteModalComponent } from './administrator-delete-modal.component';

describe('AdministratorDeleteModalComponent', () => {
  let component: AdministratorDeleteModalComponent,
      fixture: ComponentFixture<AdministratorDeleteModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdministratorDeleteModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministratorDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
