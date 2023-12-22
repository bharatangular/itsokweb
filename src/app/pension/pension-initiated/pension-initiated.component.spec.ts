import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PensionInitiatedComponent } from './pension-initiated.component';

describe('PensionInitiatedComponent', () => {
  let component: PensionInitiatedComponent;
  let fixture: ComponentFixture<PensionInitiatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PensionInitiatedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PensionInitiatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
