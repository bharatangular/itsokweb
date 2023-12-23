import { TestBed } from '@angular/core/testing';

import { FileExcelServiceService } from './file-excel-service.service';

describe('FileExcelServiceService', () => {
  let service: FileExcelServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileExcelServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
