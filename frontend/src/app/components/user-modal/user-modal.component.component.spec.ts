import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserModalComponentComponent } from './user-modal.component.component';

describe('UserModalComponentComponent', () => {
  let component: UserModalComponentComponent;
  let fixture: ComponentFixture<UserModalComponentComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UserModalComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
