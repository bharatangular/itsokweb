import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisedAutoApprovedDialogComponent } from './revised-auto-approved-dialog.component';

describe('RevisedAutoApprovedDialogComponent', () => {
  let component: RevisedAutoApprovedDialogComponent;
  let fixture: ComponentFixture<RevisedAutoApprovedDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevisedAutoApprovedDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RevisedAutoApprovedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
