import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoEmployeeComponent } from './ho-employee.component';

describe('HoEmployeeComponent', () => {
  let component: HoEmployeeComponent;
  let fixture: ComponentFixture<HoEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HoEmployeeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HoEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
