import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicDetailsPopupComponent } from './basic-details-popup.component';

describe('BasicDetailsPopupComponent', () => {
  let component: BasicDetailsPopupComponent;
  let fixture: ComponentFixture<BasicDetailsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasicDetailsPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicDetailsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
