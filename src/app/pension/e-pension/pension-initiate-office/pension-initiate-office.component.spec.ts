import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PensionInitiateOfficeComponent } from './pension-initiate-office.component';

describe('PensionInitiateOfficeComponent', () => {
  let component: PensionInitiateOfficeComponent;
  let fixture: ComponentFixture<PensionInitiateOfficeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PensionInitiateOfficeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PensionInitiateOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
