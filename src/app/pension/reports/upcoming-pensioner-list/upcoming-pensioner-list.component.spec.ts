import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingPensionerListComponent } from './upcoming-pensioner-list.component';

describe('UpcomingPensionerListComponent', () => {
  let component: UpcomingPensionerListComponent;
  let fixture: ComponentFixture<UpcomingPensionerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpcomingPensionerListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpcomingPensionerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
