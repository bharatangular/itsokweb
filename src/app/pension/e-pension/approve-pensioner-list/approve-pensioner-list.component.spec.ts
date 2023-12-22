import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovePensionerListComponent } from './approve-pensioner-list.component';

describe('ApprovePensionerListComponent', () => {
  let component: ApprovePensionerListComponent;
  let fixture: ComponentFixture<ApprovePensionerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovePensionerListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovePensionerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
