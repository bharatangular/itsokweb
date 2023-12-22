import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisedPensionerDetailsComponent } from './revised-pensioner-details.component';

describe('RevisedPensionerDetailsComponent', () => {
  let component: RevisedPensionerDetailsComponent;
  let fixture: ComponentFixture<RevisedPensionerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevisedPensionerDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RevisedPensionerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
