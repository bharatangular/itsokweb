import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewObjectionComponent } from './view-objection.component';

describe('ViewObjectionComponent', () => {
  let component: ViewObjectionComponent;
  let fixture: ComponentFixture<ViewObjectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewObjectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewObjectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
