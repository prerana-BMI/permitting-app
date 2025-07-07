import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrixDetailsComponent } from './matrix-details.component';

describe('MatrixDetailsComponent', () => {
  let component: MatrixDetailsComponent;
  let fixture: ComponentFixture<MatrixDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MatrixDetailsComponent]
    });
    fixture = TestBed.createComponent(MatrixDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
