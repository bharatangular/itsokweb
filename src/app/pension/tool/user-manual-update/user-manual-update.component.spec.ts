import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserManualUpdateComponent } from './user-manual-update.component';

describe('UserManualUpdateComponent', () => {
  let component: UserManualUpdateComponent;
  let fixture: ComponentFixture<UserManualUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserManualUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserManualUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
