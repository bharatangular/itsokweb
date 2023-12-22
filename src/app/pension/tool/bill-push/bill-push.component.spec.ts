import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillPushComponent } from './bill-push.component';

describe('BillPushComponent', () => {
  let component: BillPushComponent;
  let fixture: ComponentFixture<BillPushComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillPushComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillPushComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
