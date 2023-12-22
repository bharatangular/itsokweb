import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterConfigScreenComponent } from './master-config-screen.component';

describe('MasterConfigScreenComponent', () => {
  let component: MasterConfigScreenComponent;
  let fixture: ComponentFixture<MasterConfigScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterConfigScreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterConfigScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
