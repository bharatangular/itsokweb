import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanAndAdvanceComponent } from './loan-and-advance.component';

describe('LoanAndAdvanceComponent', () => {
  let component: LoanAndAdvanceComponent;
  let fixture: ComponentFixture<LoanAndAdvanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanAndAdvanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanAndAdvanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
