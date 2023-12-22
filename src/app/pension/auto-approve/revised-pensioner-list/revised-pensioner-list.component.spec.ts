import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisedPensionerListComponent } from './revised-pensioner-list.component';

describe('RevisedPensionerListComponent', () => {
  let component: RevisedPensionerListComponent;
  let fixture: ComponentFixture<RevisedPensionerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevisedPensionerListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RevisedPensionerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
