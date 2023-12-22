import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlternateNomineeComponent } from './alternate-nominee.component';

describe('AlternateNomineeComponent', () => {
  let component: AlternateNomineeComponent;
  let fixture: ComponentFixture<AlternateNomineeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlternateNomineeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlternateNomineeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
