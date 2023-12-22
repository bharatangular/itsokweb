import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakerEmpListComponent } from './maker-emp-list.component';

describe('MakerEmpListComponent', () => {
  let component: MakerEmpListComponent;
  let fixture: ComponentFixture<MakerEmpListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MakerEmpListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MakerEmpListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
