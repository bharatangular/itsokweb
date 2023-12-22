import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstPensionDialogComponent } from './first-pension-dialog.component';

describe('FirstPensionDialogComponent', () => {
  let component: FirstPensionDialogComponent;
  let fixture: ComponentFixture<FirstPensionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirstPensionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstPensionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
