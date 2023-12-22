import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PensionCalculationComponent } from './pension-calculation.component';

describe('PensionCalculationComponent', () => {
  let component: PensionCalculationComponent;
  let fixture: ComponentFixture<PensionCalculationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PensionCalculationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PensionCalculationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
