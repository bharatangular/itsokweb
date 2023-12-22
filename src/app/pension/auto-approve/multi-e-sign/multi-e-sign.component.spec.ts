import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiESignComponent } from './multi-e-sign.component';

describe('MultiESignComponent', () => {
  let component: MultiESignComponent;
  let fixture: ComponentFixture<MultiESignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiESignComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiESignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
