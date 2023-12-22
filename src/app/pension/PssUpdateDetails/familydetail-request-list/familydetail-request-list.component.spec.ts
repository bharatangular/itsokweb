import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilydetailRequestListComponent } from './familydetail-request-list.component';

describe('FamilydetailRequestListComponent', () => {
  let component: FamilydetailRequestListComponent;
  let fixture: ComponentFixture<FamilydetailRequestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FamilydetailRequestListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilydetailRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
