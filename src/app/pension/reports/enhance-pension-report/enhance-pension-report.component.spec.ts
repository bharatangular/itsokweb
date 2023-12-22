import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnhancePensionReportComponent } from './enhance-pension-report.component';

describe('EnhancePensionReportComponent', () => {
  let component: EnhancePensionReportComponent;
  let fixture: ComponentFixture<EnhancePensionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnhancePensionReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnhancePensionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
