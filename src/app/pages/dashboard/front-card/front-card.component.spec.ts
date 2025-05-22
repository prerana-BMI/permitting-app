import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontCardComponent } from './front-card.component';

describe('FrontCardComponent', () => {
  let component: FrontCardComponent;
  let fixture: ComponentFixture<FrontCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FrontCardComponent]
    });
    fixture = TestBed.createComponent(FrontCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
