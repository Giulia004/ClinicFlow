import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackPageComponent } from './feedback.page';

describe('FeedbackPageComponent', () => {
  let component: FeedbackPageComponent;
  let fixture: ComponentFixture<FeedbackPageComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
