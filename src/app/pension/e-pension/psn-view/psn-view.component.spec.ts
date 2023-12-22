import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsnViewComponent } from './psn-view.component';

describe('PsnViewComponent', () => {
  let component: PsnViewComponent;
  let fixture: ComponentFixture<PsnViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PsnViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PsnViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
