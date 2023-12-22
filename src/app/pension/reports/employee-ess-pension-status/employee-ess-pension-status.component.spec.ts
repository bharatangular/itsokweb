import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeEssPensionStatusComponent } from './employee-ess-pension-status.component';

describe('EmployeeEssPensionStatusComponent', () => {
  let component: EmployeeEssPensionStatusComponent;
  let fixture: ComponentFixture<EmployeeEssPensionStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeEssPensionStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeEssPensionStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
