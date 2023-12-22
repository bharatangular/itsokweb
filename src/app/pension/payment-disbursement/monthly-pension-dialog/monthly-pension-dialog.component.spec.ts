import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyPensionDialogComponent } from './monthly-pension-dialog.component';

describe('MonthlyPensionDialogComponent', () => {
  let component: MonthlyPensionDialogComponent;
  let fixture: ComponentFixture<MonthlyPensionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthlyPensionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyPensionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
