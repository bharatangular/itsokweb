import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkBillsComponent } from './mark-bills.component';

describe('MarkBillsComponent', () => {
  let component: MarkBillsComponent;
  let fixture: ComponentFixture<MarkBillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarkBillsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkBillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
