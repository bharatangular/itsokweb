import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficeDetailByOfficeIdComponent } from './office-detail-by-office-id.component';

describe('OfficeDetailByOfficeIdComponent', () => {
  let component: OfficeDetailByOfficeIdComponent;
  let fixture: ComponentFixture<OfficeDetailByOfficeIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfficeDetailByOfficeIdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficeDetailByOfficeIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
