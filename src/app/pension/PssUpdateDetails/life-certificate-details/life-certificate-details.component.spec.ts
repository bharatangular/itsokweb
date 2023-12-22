import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LifeCertificateDetailsComponent } from './life-certificate-details.component';

describe('LifeCertificateDetailsComponent', () => {
  let component: LifeCertificateDetailsComponent;
  let fixture: ComponentFixture<LifeCertificateDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LifeCertificateDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LifeCertificateDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
