import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogLeaveTransferComponent } from './dialog-leave-transfer.component';

describe('DialogLeaveTransferComponent', () => {
  let component: DialogLeaveTransferComponent;
  let fixture: ComponentFixture<DialogLeaveTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogLeaveTransferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogLeaveTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
