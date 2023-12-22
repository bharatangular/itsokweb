import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilydetailViewComponent } from './familydetail-view.component';

describe('FamilydetailViewComponent', () => {
  let component: FamilydetailViewComponent;
  let fixture: ComponentFixture<FamilydetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FamilydetailViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilydetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
