import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RvnlDetailsComponent } from './rvnl-details.component';

describe('RvnlDetailsComponent', () => {
  let component: RvnlDetailsComponent;
  let fixture: ComponentFixture<RvnlDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RvnlDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RvnlDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
