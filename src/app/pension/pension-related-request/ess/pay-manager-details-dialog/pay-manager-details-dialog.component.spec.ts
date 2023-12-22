import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayManagerDetailsDialogComponent } from './pay-manager-details-dialog.component';

describe('PayManagerDetailsDialogComponent', () => {
  let component: PayManagerDetailsDialogComponent;
  let fixture: ComponentFixture<PayManagerDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayManagerDetailsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayManagerDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
