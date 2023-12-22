import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisedCommutationReportComponent } from './revised-commutation-report.component';

describe('RevisedCommutationReportComponent', () => {
  let component: RevisedCommutationReportComponent;
  let fixture: ComponentFixture<RevisedCommutationReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevisedCommutationReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RevisedCommutationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
