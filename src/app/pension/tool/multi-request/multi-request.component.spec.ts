import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiRequestComponent } from './multi-request.component';

describe('MultiRequestComponent', () => {
  let component: MultiRequestComponent;
  let fixture: ComponentFixture<MultiRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
