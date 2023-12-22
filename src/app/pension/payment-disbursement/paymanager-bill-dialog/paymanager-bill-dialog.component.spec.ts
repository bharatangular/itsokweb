import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymanagerBillDialogComponent } from './paymanager-bill-dialog.component';

describe('PaymanagerBillDialogComponent', () => {
  let component: PaymanagerBillDialogComponent;
  let fixture: ComponentFixture<PaymanagerBillDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymanagerBillDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymanagerBillDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
