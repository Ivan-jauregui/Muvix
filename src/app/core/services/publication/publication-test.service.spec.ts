import { TestBed } from '@angular/core/testing';

import { PublicationTestService } from './publication-test.service';

describe('PublicationTestService', () => {
  let service: PublicationTestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PublicationTestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
