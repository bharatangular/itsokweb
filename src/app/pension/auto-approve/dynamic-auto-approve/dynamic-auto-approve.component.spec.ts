import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicAutoApproveComponent } from './dynamic-auto-approve.component';

describe('DynamicAutoApproveComponent', () => {
  let component: DynamicAutoApproveComponent;
  let fixture: ComponentFixture<DynamicAutoApproveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicAutoApproveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicAutoApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
