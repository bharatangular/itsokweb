import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingPensionerToolsListComponent } from './upcoming-pensioner-tools-list.component';

describe('UpcomingPensionerToolsListComponent', () => {
  let component: UpcomingPensionerToolsListComponent;
  let fixture: ComponentFixture<UpcomingPensionerToolsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpcomingPensionerToolsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpcomingPensionerToolsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
