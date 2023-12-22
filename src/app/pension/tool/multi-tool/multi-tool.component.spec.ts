import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiToolComponent } from './multi-tool.component';

describe('MultiToolComponent', () => {
  let component: MultiToolComponent;
  let fixture: ComponentFixture<MultiToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiToolComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
