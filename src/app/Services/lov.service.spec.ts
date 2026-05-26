import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LovService } from './lov.service';

describe('LovService Caching', () => {
  let service: LovService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LovService]
    });
    service = TestBed.inject(LovService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should cache getCategories response', () => {
    const mockData = { data: [[{ title: 'Cat 1' }]] };

    // First call
    service.getCategories().subscribe(data => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`);
    expect(req.request.method).toBe('POST');
    req.flush(mockData);

    // Second call - should not trigger a new HTTP request
    service.getCategories().subscribe(data => {
      expect(data).toEqual(mockData);
    });

    httpMock.expectNone(`${service.baseApiUrl}/LovType/findAllLovType`);
  });

  it('should clear cache on addlov', () => {
    const mockData = { data: [[{ title: 'Cat 1' }]] };

    // Cache it
    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`).flush(mockData);

    // Add LOV should clear cache
    service.addlov({ title: 'New LOV' }).subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/lov/addlov`).flush({});

    // Next getCategories should trigger a new request
    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`).flush(mockData);
  });

  it('should reset cache on error', () => {
    // First call fails
    service.getCategories().subscribe({
      error: () => {}
    });
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`).flush('Error', { status: 500, statusText: 'Server Error' });

    // Second call should retry
    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`).flush({ data: [] });
  });
});
