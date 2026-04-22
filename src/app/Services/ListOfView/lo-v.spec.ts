import { TestBed } from '@angular/core/testing';

import { LoV } from './lo-v';

describe('LoV', () => {
  let service: LoV;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoV);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
