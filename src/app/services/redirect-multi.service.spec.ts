import { TestBed } from '@angular/core/testing';

import { RedirectMultiService } from './redirect-multi.service';

describe('RedirectMultiService', () => {
  let service: RedirectMultiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RedirectMultiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
