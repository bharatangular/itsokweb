import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PensionerDetailsViewComponent } from './pensioner-details-view.component';

describe('PensionerDetailsViewComponent', () => {
  let component: PensionerDetailsViewComponent;
  let fixture: ComponentFixture<PensionerDetailsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PensionerDetailsViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PensionerDetailsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
