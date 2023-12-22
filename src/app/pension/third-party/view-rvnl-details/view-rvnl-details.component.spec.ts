import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRvnlDetailsComponent } from './view-rvnl-details.component';

describe('ViewRvnlDetailsComponent', () => {
  let component: ViewRvnlDetailsComponent;
  let fixture: ComponentFixture<ViewRvnlDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewRvnlDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRvnlDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
