import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPermitsComponent } from './add-permits.component';

describe('AddPermitsComponent', () => {
  let component: AddPermitsComponent;
  let fixture: ComponentFixture<AddPermitsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddPermitsComponent]
    });
    fixture = TestBed.createComponent(AddPermitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
