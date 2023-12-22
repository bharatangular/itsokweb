import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoneOfficeWisePendencyReportComponent } from './zone-office-wise-pendency-report.component';

describe('ZoneOfficeWisePendencyReportComponent', () => {
  let component: ZoneOfficeWisePendencyReportComponent;
  let fixture: ComponentFixture<ZoneOfficeWisePendencyReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZoneOfficeWisePendencyReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoneOfficeWisePendencyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
