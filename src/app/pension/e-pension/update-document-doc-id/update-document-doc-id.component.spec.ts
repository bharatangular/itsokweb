import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDocumentDocIdComponent } from './update-document-doc-id.component';

describe('UpdateDocumentDocIdComponent', () => {
  let component: UpdateDocumentDocIdComponent;
  let fixture: ComponentFixture<UpdateDocumentDocIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateDocumentDocIdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateDocumentDocIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
