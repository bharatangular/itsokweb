import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficeRolebyReportComponent } from './office-roleby-report.component';

describe('OfficeRolebyReportComponent', () => {
  let component: OfficeRolebyReportComponent;
  let fixture: ComponentFixture<OfficeRolebyReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfficeRolebyReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficeRolebyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
