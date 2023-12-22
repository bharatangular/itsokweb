import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkVrsComponent } from './mark-vrs.component';

describe('MarkVrsComponent', () => {
  let component: MarkVrsComponent;
  let fixture: ComponentFixture<MarkVrsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarkVrsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkVrsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
