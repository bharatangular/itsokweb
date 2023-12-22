import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkEmpDeComponent } from './mark-emp-de.component';

describe('MarkEmpDeComponent', () => {
  let component: MarkEmpDeComponent;
  let fixture: ComponentFixture<MarkEmpDeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarkEmpDeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkEmpDeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
