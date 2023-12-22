import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsnPendingFilesOfficeWiseComponent } from './psn-pending-files-office-wise.component';

describe('PsnPendingFilesOfficeWiseComponent', () => {
  let component: PsnPendingFilesOfficeWiseComponent;
  let fixture: ComponentFixture<PsnPendingFilesOfficeWiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PsnPendingFilesOfficeWiseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PsnPendingFilesOfficeWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
