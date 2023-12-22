import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoApprovePensionerListComponent } from './ho-approve-pensioner-list.component';

describe('HoApprovePensionerListComponent', () => {
  let component: HoApprovePensionerListComponent;
  let fixture: ComponentFixture<HoApprovePensionerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HoApprovePensionerListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HoApprovePensionerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
