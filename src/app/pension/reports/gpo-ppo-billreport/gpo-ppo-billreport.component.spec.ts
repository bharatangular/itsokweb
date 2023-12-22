import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GpoPpoBillreportComponent } from './gpo-ppo-billreport.component';

describe('GpoPpoBillreportComponent', () => {
  let component: GpoPpoBillreportComponent;
  let fixture: ComponentFixture<GpoPpoBillreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GpoPpoBillreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GpoPpoBillreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
