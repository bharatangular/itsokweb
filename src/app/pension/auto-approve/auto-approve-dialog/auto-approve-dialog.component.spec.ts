import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoApproveDialogComponent } from './auto-approve-dialog.component';

describe('AutoApproveDialogComponent', () => {
  let component: AutoApproveDialogComponent;
  let fixture: ComponentFixture<AutoApproveDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutoApproveDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoApproveDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
