import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonDialogForReportsComponent } from './common-dialog-for-reports.component';

describe('CommonDialogForReportsComponent', () => {
  let component: CommonDialogForReportsComponent;
  let fixture: ComponentFixture<CommonDialogForReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonDialogForReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonDialogForReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
