import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceRecordDialogComponent } from './service-record-dialog.component';

describe('ServiceRecordDialogComponent', () => {
  let component: ServiceRecordDialogComponent;
  let fixture: ComponentFixture<ServiceRecordDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceRecordDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceRecordDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
