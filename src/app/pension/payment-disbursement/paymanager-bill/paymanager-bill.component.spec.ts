import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymanagerBillComponent } from './paymanager-bill.component';

describe('PaymanagerBillComponent', () => {
  let component: PaymanagerBillComponent;
  let fixture: ComponentFixture<PaymanagerBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymanagerBillComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymanagerBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
