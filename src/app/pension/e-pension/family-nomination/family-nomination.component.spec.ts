import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyNominationComponent } from './family-nomination.component';

describe('FamilyNominationComponent', () => {
  let component: FamilyNominationComponent;
  let fixture: ComponentFixture<FamilyNominationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FamilyNominationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyNominationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
