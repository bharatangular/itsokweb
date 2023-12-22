import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PensionEssViewComponent } from './pension-ess-view.component';

describe('PensionEssViewComponent', () => {
  let component: PensionEssViewComponent;
  let fixture: ComponentFixture<PensionEssViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PensionEssViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PensionEssViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
