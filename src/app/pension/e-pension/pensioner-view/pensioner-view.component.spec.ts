import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PensionerViewComponent } from './pensioner-view.component';

describe('PensionerViewComponent', () => {
  let component: PensionerViewComponent;
  let fixture: ComponentFixture<PensionerViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PensionerViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PensionerViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
