import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PensionSummaryComponent } from './pension-summary.component';

describe('PensionSummaryComponent', () => {
  let component: PensionSummaryComponent;
  let fixture: ComponentFixture<PensionSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PensionSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PensionSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
