import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkEmpDeDialogComponent } from './mark-emp-de-dialog.component';

describe('MarkEmpDeDialogComponent', () => {
  let component: MarkEmpDeDialogComponent;
  let fixture: ComponentFixture<MarkEmpDeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarkEmpDeDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkEmpDeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
