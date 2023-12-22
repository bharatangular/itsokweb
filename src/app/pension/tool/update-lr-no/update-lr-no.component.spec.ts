import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateLrNoComponent } from './update-lr-no.component';

describe('UpdateLrNoComponent', () => {
  let component: UpdateLrNoComponent;
  let fixture: ComponentFixture<UpdateLrNoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateLrNoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateLrNoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
