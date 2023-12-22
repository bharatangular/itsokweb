import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsnPendingStatusDetailComponent } from './psn-pending-status-detail.component';

describe('PsnPendingStatusDetailComponent', () => {
  let component: PsnPendingStatusDetailComponent;
  let fixture: ComponentFixture<PsnPendingStatusDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PsnPendingStatusDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PsnPendingStatusDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
