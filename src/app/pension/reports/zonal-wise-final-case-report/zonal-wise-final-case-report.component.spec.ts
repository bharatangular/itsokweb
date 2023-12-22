import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZonalWiseFinalCaseReportComponent } from './zonal-wise-final-case-report.component';

describe('ZonalWiseFinalCaseReportComponent', () => {
  let component: ZonalWiseFinalCaseReportComponent;
  let fixture: ComponentFixture<ZonalWiseFinalCaseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZonalWiseFinalCaseReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZonalWiseFinalCaseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
