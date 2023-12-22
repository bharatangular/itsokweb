import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessTaskConfigComponent } from './process-task-config.component';

describe('ProcessTaskConfigComponent', () => {
  let component: ProcessTaskConfigComponent;
  let fixture: ComponentFixture<ProcessTaskConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessTaskConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessTaskConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
