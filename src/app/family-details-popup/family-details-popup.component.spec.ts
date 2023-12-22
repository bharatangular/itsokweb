import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyDetailsPopupComponent } from './family-details-popup.component';

describe('FamilyDetailsPopupComponent', () => {
  let component: FamilyDetailsPopupComponent;
  let fixture: ComponentFixture<FamilyDetailsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FamilyDetailsPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyDetailsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
