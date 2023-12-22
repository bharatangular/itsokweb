import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisedCpoComponent } from './revised-cpo.component';

describe('RevisedCpoComponent', () => {
  let component: RevisedCpoComponent;
  let fixture: ComponentFixture<RevisedCpoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevisedCpoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RevisedCpoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
