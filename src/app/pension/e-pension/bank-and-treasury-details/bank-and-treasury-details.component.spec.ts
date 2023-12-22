import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankAndTreasuryDetailsComponent } from './bank-and-treasury-details.component';

describe('BankAndTreasuryDetailsComponent', () => {
  let component: BankAndTreasuryDetailsComponent;
  let fixture: ComponentFixture<BankAndTreasuryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankAndTreasuryDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankAndTreasuryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
