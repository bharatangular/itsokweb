import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkLeaveComponent } from './mark-leave.component';

describe('MarkLeaveComponent', () => {
  let component: MarkLeaveComponent;
  let fixture: ComponentFixture<MarkLeaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarkLeaveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
