import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackCardComponent } from './back-card.component';

describe('BackCardComponent', () => {
  let component: BackCardComponent;
  let fixture: ComponentFixture<BackCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BackCardComponent]
    });
    fixture = TestBed.createComponent(BackCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
