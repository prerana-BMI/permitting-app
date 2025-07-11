import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedPermitComponent } from './selected-permit.component';

describe('SelectedPermitComponent', () => {
  let component: SelectedPermitComponent;
  let fixture: ComponentFixture<SelectedPermitComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectedPermitComponent]
    });
    fixture = TestBed.createComponent(SelectedPermitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
