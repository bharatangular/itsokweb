import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewfooterComponent } from './newfooter.component';

describe('NewfooterComponent', () => {
  let component: NewfooterComponent;
  let fixture: ComponentFixture<NewfooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewfooterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewfooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
