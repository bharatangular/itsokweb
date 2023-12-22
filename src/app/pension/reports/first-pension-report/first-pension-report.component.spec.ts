import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstPensionReportComponent } from './first-pension-report.component';

describe('FirstPensionReportComponent', () => {
  let component: FirstPensionReportComponent;
  let fixture: ComponentFixture<FirstPensionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirstPensionReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstPensionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
