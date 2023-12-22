import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessLevelMappingComponent } from './process-level-mapping.component';

describe('ProcessLevelMappingComponent', () => {
  let component: ProcessLevelMappingComponent;
  let fixture: ComponentFixture<ProcessLevelMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessLevelMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessLevelMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
