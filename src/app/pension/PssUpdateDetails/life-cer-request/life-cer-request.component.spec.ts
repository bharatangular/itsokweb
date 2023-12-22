import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LifeCerRequestComponent } from './life-cer-request.component';

describe('LifeCerRequestComponent', () => {
  let component: LifeCerRequestComponent;
  let fixture: ComponentFixture<LifeCerRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LifeCerRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LifeCerRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
