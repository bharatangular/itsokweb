import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserManualFormComponent } from './user-manual-form.component';

describe('UserManualFormComponent', () => {
  let component: UserManualFormComponent;
  let fixture: ComponentFixture<UserManualFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserManualFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserManualFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
