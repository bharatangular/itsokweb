import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EPensionComponent } from './e-pension.component';

describe('EPensionComponent', () => {
  let component: EPensionComponent;
  let fixture: ComponentFixture<EPensionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EPensionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EPensionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
