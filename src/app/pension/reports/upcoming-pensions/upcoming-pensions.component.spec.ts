import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingPensionsComponent } from './upcoming-pensions.component';

describe('UpcomingPensionsComponent', () => {
  let component: UpcomingPensionsComponent;
  let fixture: ComponentFixture<UpcomingPensionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpcomingPensionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpcomingPensionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
