import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiKittenComponent } from './ui-kitten.component';

describe('UiKittenComponent', () => {
  let component: UiKittenComponent;
  let fixture: ComponentFixture<UiKittenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UiKittenComponent]
    });
    fixture = TestBed.createComponent(UiKittenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
