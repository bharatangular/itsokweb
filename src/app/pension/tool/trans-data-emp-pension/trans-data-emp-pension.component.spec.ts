import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransDataEmpPensionComponent } from './trans-data-emp-pension.component';

describe('TransDataEmpPensionComponent', () => {
  let component: TransDataEmpPensionComponent;
  let fixture: ComponentFixture<TransDataEmpPensionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransDataEmpPensionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransDataEmpPensionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
