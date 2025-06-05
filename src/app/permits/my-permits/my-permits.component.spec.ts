import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPermitsComponent } from './my-permits.component';

describe('MyPermitsComponent', () => {
  let component: MyPermitsComponent;
  let fixture: ComponentFixture<MyPermitsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyPermitsComponent]
    });
    fixture = TestBed.createComponent(MyPermitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
