import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkEmpPensionComponent } from './mark-emp-pension.component';

describe('MarkEmpPensionComponent', () => {
  let component: MarkEmpPensionComponent;
  let fixture: ComponentFixture<MarkEmpPensionComponent>; 

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarkEmpPensionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkEmpPensionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
