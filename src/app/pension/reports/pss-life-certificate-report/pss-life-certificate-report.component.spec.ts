import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PssLifeCertificateReportComponent } from './pss-life-certificate-report.component';

describe('PssLifeCertificateReportComponent', () => {
  let component: PssLifeCertificateReportComponent;
  let fixture: ComponentFixture<PssLifeCertificateReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PssLifeCertificateReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PssLifeCertificateReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
