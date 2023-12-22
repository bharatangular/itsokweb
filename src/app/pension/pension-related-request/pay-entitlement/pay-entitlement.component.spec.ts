import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayEntitlementComponent } from './pay-entitlement.component';

describe('PayEntitlementComponent', () => {
  let component: PayEntitlementComponent;
  let fixture: ComponentFixture<PayEntitlementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayEntitlementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayEntitlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
