import { TestBed } from '@angular/core/testing';

import { EncryptionDownloadService } from './encryption-download.service';

describe('EncryptionDownloadService', () => {
  let service: EncryptionDownloadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EncryptionDownloadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
