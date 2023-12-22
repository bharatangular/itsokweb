import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestMarkVrsComponent } from './request-mark-vrs.component';

describe('RequestMarkVrsComponent', () => {
  let component: RequestMarkVrsComponent;
  let fixture: ComponentFixture<RequestMarkVrsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestMarkVrsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestMarkVrsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
