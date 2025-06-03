import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermitHomeComponent } from './permit-home.component';

describe('PermitHomeComponent', () => {
  let component: PermitHomeComponent;
  let fixture: ComponentFixture<PermitHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PermitHomeComponent]
    });
    fixture = TestBed.createComponent(PermitHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
