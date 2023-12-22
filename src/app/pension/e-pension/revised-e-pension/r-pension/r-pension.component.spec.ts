import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RPensionComponent } from './r-pension.component';

describe('RPensionComponent', () => {
  let component: RPensionComponent;
  let fixture: ComponentFixture<RPensionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RPensionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RPensionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
