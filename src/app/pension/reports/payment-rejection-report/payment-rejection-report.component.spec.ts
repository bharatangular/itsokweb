import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentRejectionReportComponent } from './payment-rejection-report.component';

describe('PaymentRejectionReportComponent', () => {
  let component: PaymentRejectionReportComponent;
  let fixture: ComponentFixture<PaymentRejectionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentRejectionReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentRejectionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
