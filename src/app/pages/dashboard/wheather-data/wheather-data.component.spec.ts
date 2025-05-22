import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WheatherDataComponent } from './wheather-data.component';

describe('WheatherDataComponent', () => {
  let component: WheatherDataComponent;
  let fixture: ComponentFixture<WheatherDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WheatherDataComponent]
    });
    fixture = TestBed.createComponent(WheatherDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
