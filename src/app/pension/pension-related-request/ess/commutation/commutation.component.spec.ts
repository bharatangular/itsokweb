import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommutationComponent } from './commutation.component';

describe('CommutationComponent', () => {
  let component: CommutationComponent;
  let fixture: ComponentFixture<CommutationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommutationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommutationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
