import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevertListComponent } from './revert-list.component';

describe('RevertListComponent', () => {
  let component: RevertListComponent;
  let fixture: ComponentFixture<RevertListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevertListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RevertListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
