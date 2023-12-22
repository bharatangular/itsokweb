import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestPayManagerComponent } from './request-pay-manager.component';

describe('RequestPayManagerComponent', () => {
  let component: RequestPayManagerComponent;
  let fixture: ComponentFixture<RequestPayManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestPayManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestPayManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
