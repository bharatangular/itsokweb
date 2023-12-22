import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkVrsListComponent } from './mark-vrs-list.component';

describe('MarkVrsListComponent', () => {
  let component: MarkVrsListComponent;
  let fixture: ComponentFixture<MarkVrsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarkVrsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkVrsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
