import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterWidgetComponent } from './filter-widget.component';

describe('FilterWidgetComponent', () => {
  let component: FilterWidgetComponent;
  let fixture: ComponentFixture<FilterWidgetComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterWidgetComponent);
    fixture.componentRef.setInput('data', []);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
