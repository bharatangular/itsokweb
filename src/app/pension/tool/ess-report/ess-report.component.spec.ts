import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EssReportComponent } from './ess-report.component';

describe('EssReportComponent', () => {
  let component: EssReportComponent;
  let fixture: ComponentFixture<EssReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EssReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EssReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
