import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPensionEssComponent } from './view-pension-ess.component';

describe('ViewPensionEssComponent', () => {
  let component: ViewPensionEssComponent;
  let fixture: ComponentFixture<ViewPensionEssComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPensionEssComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPensionEssComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
