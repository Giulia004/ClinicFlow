import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlotPageComponent } from './slot.page';

describe('SlotPageComponent', () => {
  let component: SlotPageComponent;
  let fixture: ComponentFixture<SlotPageComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SlotPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
