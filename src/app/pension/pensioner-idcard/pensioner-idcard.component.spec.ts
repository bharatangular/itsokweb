import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PensionerIdcardComponent } from './pensioner-idcard.component';

describe('PensionerIdcardComponent', () => {
  let component: PensionerIdcardComponent;
  let fixture: ComponentFixture<PensionerIdcardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PensionerIdcardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PensionerIdcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
