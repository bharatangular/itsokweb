import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingMultiEsignComponent } from './pending-multi-esign.component';

describe('PendingMultiEsignComponent', () => {
  let component: PendingMultiEsignComponent;
  let fixture: ComponentFixture<PendingMultiEsignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingMultiEsignComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingMultiEsignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
