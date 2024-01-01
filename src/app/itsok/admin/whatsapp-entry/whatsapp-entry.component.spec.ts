import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsappEntryComponent } from './whatsapp-entry.component';

describe('WhatsappEntryComponent', () => {
  let component: WhatsappEntryComponent;
  let fixture: ComponentFixture<WhatsappEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhatsappEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhatsappEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
