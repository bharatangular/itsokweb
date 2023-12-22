import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkEmpRelieveDialogComponent } from './mark-emp-relieve-dialog.component';

describe('MarkEmpRelieveDialogComponent', () => {
  let component: MarkEmpRelieveDialogComponent;
  let fixture: ComponentFixture<MarkEmpRelieveDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarkEmpRelieveDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkEmpRelieveDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
