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

  it('should cache categories after first call', () => {
    const mockResponse = { data: [[{ lovTypeId: 1, title: 'Category 1' }]] };

    // First call
    service.getCategories().subscribe();
    const req1 = httpMock.expectOne(service.baseApiUrl + '/LovType/findAllLovType');
    req1.flush(mockResponse);

    // Second call
    service.getCategories().subscribe();
    httpMock.expectNone(service.baseApiUrl + '/LovType/findAllLovType');
  });

  it('should cache list of values by lovTypeId', () => {
    const lovTypeId = 123;
    const mockResponse = { data: [[{ lovId: 1, title: 'Value 1' }]] };

    // First call
    service.getListOfValues(lovTypeId).subscribe();
    const req1 = httpMock.expectOne(`${service.baseApiUrl}/lov/findAlllov`);
    expect(req1.request.body.data[0].lovTypeId).toBe(lovTypeId);
    req1.flush(mockResponse);

    // Second call for same ID
    service.getListOfValues(lovTypeId).subscribe();
    httpMock.expectNone(`${service.baseApiUrl}/lov/findAlllov`);

    // Call for different ID
    const otherId = 456;
    service.getListOfValues(otherId).subscribe();
    const req2 = httpMock.expectOne(`${service.baseApiUrl}/lov/findAlllov`);
    expect(req2.request.body.data[0].lovTypeId).toBe(otherId);
    req2.flush(mockResponse);
  });

  it('should clear cache on clearCache()', () => {
    const mockResponse = { data: [[{ lovTypeId: 1, title: 'Category 1' }]] };

    // Call and cache
    service.getCategories().subscribe();
    httpMock.expectOne(service.baseApiUrl + '/LovType/findAllLovType').flush(mockResponse);

    // Clear cache
    service.clearCache();

    // Next call should trigger new request
    service.getCategories().subscribe();
    httpMock.expectOne(service.baseApiUrl + '/LovType/findAllLovType').flush(mockResponse);
  });

  it('should invalidate cache on addlov', () => {
    const mockResponse = { data: [[{ lovTypeId: 1, title: 'Category 1' }]] };

    // Cache categories
    service.getCategories().subscribe();
    httpMock.expectOne(service.baseApiUrl + '/LovType/findAllLovType').flush(mockResponse);

    // Add LOV
    service.addlov({ title: 'New' }).subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/lov/addlov`).flush({ success: true });

    // Cache should be cleared, next getCategories triggers request
    service.getCategories().subscribe();
    httpMock.expectOne(service.baseApiUrl + '/LovType/findAllLovType').flush(mockResponse);
  });

  it('should reset cache on error to allow retry', () => {
    // First call fails
    service.getCategories().subscribe({
      error: () => {}
    });
    const req1 = httpMock.expectOne(service.baseApiUrl + '/LovType/findAllLovType');
    req1.error(new ErrorEvent('Network error'));

    // Second call should try again (not use cached error)
    service.getCategories().subscribe();
    const req2 = httpMock.expectOne(service.baseApiUrl + '/LovType/findAllLovType');
    req2.flush({ data: [[]] });
  });
});
