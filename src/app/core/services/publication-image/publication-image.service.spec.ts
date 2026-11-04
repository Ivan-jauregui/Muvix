import { TestBed } from '@angular/core/testing';

import { PublicationImageService } from './publication-image.service';

describe('PublicationImageService', () => {
  let service: PublicationImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PublicationImageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
