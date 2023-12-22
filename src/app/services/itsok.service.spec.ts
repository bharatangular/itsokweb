import { TestBed } from '@angular/core/testing';

import { ItsokService } from './itsok.service';

describe('ItsokService', () => {
  let service: ItsokService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItsokService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
