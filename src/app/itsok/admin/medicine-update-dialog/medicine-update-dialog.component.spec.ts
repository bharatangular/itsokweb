import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicineUpdateDialogComponent } from './medicine-update-dialog.component';

describe('MedicineUpdateDialogComponent', () => {
  let component: MedicineUpdateDialogComponent;
  let fixture: ComponentFixture<MedicineUpdateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicineUpdateDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicineUpdateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
