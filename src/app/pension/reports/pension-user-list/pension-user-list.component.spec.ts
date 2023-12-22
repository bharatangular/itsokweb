import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PensionUserListComponent } from './pension-user-list.component';

describe('PensionUserListComponent', () => {
  let component: PensionUserListComponent;
  let fixture: ComponentFixture<PensionUserListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PensionUserListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PensionUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
