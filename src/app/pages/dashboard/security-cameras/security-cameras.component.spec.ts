import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityCamerasComponent } from './security-cameras.component';

describe('SecurityCamerasComponent', () => {
  let component: SecurityCamerasComponent;
  let fixture: ComponentFixture<SecurityCamerasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SecurityCamerasComponent]
    });
    fixture = TestBed.createComponent(SecurityCamerasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
