import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsignModalComponent } from './esign-modal.component';

describe('EsignModalComponent', () => {
  let component: EsignModalComponent;
  let fixture: ComponentFixture<EsignModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsignModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EsignModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
