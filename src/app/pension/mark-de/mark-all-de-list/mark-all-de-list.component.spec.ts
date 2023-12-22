import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkAllDeListComponent } from './mark-all-de-list.component';

describe('MarkAllDeListComponent', () => {
  let component: MarkAllDeListComponent;
  let fixture: ComponentFixture<MarkAllDeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarkAllDeListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkAllDeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
