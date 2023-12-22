import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDocumetComponent } from './upload-documet.component';

describe('UploadDocumetComponent', () => {
  let component: UploadDocumetComponent;
  let fixture: ComponentFixture<UploadDocumetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadDocumetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadDocumetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
