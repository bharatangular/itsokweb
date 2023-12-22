import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewPensionEssComponent } from './preview-pension-ess.component';

describe('PreviewPensionEssComponent', () => {
  let component: PreviewPensionEssComponent;
  let fixture: ComponentFixture<PreviewPensionEssComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewPensionEssComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewPensionEssComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
