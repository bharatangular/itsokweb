import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkAutoApproveComponent } from './mark-auto-approve.component';

describe('MarkAutoApproveComponent', () => {
  let component: MarkAutoApproveComponent;
  let fixture: ComponentFixture<MarkAutoApproveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarkAutoApproveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkAutoApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
