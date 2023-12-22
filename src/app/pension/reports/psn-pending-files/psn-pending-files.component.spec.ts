import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsnPendingFilesComponent } from './psn-pending-files.component';

describe('PsnPendingFilesComponent', () => {
  let component: PsnPendingFilesComponent;
  let fixture: ComponentFixture<PsnPendingFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PsnPendingFilesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PsnPendingFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
