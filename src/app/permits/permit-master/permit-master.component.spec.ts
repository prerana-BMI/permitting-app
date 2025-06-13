import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermitMasterComponent } from './permit-master.component';

describe('PermitMasterComponent', () => {
  let component: PermitMasterComponent;
  let fixture: ComponentFixture<PermitMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PermitMasterComponent]
    });
    fixture = TestBed.createComponent(PermitMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
