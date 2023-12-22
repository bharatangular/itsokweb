import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkEmployeeRelieveComponent } from './mark-employee-relieve.component';

describe('MarkEmployeeRelieveComponent', () => {
  let component: MarkEmployeeRelieveComponent;
  let fixture: ComponentFixture<MarkEmployeeRelieveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarkEmployeeRelieveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkEmployeeRelieveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
