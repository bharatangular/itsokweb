import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingEsignComponent } from './pending-esign.component';

describe('PendingEsignComponent', () => {
  let component: PendingEsignComponent;
  let fixture: ComponentFixture<PendingEsignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingEsignComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingEsignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
