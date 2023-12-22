import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakerPensionerListComponent } from './maker-pensioner-list.component';

describe('MakerPensionerListComponent', () => {
  let component: MakerPensionerListComponent;
  let fixture: ComponentFixture<MakerPensionerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MakerPensionerListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MakerPensionerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
