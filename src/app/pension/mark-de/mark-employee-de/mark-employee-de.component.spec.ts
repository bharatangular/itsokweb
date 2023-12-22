import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkEmployeeDeComponent } from './mark-employee-de.component';

describe('MarkEmployeeDeComponent', () => {
  let component: MarkEmployeeDeComponent;
  let fixture: ComponentFixture<MarkEmployeeDeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarkEmployeeDeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkEmployeeDeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
