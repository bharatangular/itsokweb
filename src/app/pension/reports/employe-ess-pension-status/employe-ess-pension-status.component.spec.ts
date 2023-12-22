import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeEssPensionStatusComponent } from './employe-ess-pension-status.component';

describe('EmployeEssPensionStatusComponent', () => {
  let component: EmployeEssPensionStatusComponent;
  let fixture: ComponentFixture<EmployeEssPensionStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeEssPensionStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeEssPensionStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
