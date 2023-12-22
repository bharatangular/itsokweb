import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisedPensionComponent } from './revised-pension.component';

describe('RevisedPensionComponent', () => {
  let component: RevisedPensionComponent;
  let fixture: ComponentFixture<RevisedPensionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevisedPensionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RevisedPensionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
