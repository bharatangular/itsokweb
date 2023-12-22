import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessTaskActionComponent } from './process-task-action.component';

describe('ProcessTaskActionComponent', () => {
  let component: ProcessTaskActionComponent;
  let fixture: ComponentFixture<ProcessTaskActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessTaskActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessTaskActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
