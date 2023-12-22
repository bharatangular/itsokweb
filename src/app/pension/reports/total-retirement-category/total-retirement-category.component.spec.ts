import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalRetirementCategoryComponent } from './total-retirement-category.component';

describe('TotalRetirementCategoryComponent', () => {
  let component: TotalRetirementCategoryComponent;
  let fixture: ComponentFixture<TotalRetirementCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TotalRetirementCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalRetirementCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
