import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PensionKitComponent } from './pension-kit.component';

describe('PensionKitComponent', () => {
  let component: PensionKitComponent;
  let fixture: ComponentFixture<PensionKitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PensionKitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PensionKitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
