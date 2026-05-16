import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { LovService } from './lov.service';

describe('LovService Caching', () => {
  let service: LovService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LovService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });
    service = TestBed.inject(LovService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should cache getCategories results', () => {
    const mockResponse = { data: [[{ lovTypeId: 1, title: 'Category 1' }]] };

    // First call
    service.getCategories().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(service.baseApiUrl + '/LovType/findAllLovType');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    // Second call - should not trigger another HTTP request
    service.getCategories().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    httpMock.expectNone(service.baseApiUrl + '/LovType/findAllLovType');
  });

  it('should cache getListOfValues results by lovTypeId', () => {
    const lovTypeId = 123;
    const mockResponse = { data: [[{ lovId: 1, title: 'Value 1' }]] };

    // First call
    service.getListOfValues(lovTypeId).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service.baseApiUrl}/lov/findAlllov`);
    req.flush(mockResponse);

    // Second call for same ID - should be cached
    service.getListOfValues(lovTypeId).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    httpMock.expectNone(`${service.baseApiUrl}/lov/findAlllov`);

    // Call for different ID - should trigger new request
    const otherId = 456;
    service.getListOfValues(otherId).subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/lov/findAlllov`);
  });

  it('should invalidate cache when clearCache is called', () => {
    const mockResponse = { data: [] };

    service.getCategories().subscribe();
    httpMock.expectOne(service.baseApiUrl + '/LovType/findAllLovType').flush(mockResponse);

    service.clearCache();

    service.getCategories().subscribe();
    // Should trigger new request because cache was cleared
    httpMock.expectOne(service.baseApiUrl + '/LovType/findAllLovType').flush(mockResponse);
  });

  it('should invalidate cache when addlov is called', () => {
    service.getCategories().subscribe();
    httpMock.expectOne(service.baseApiUrl + '/LovType/findAllLovType').flush({ data: [] });

    service.addlov({ title: 'New' }).subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/lov/addlov`).flush({ success: true });

    service.getCategories().subscribe();
    // Should trigger new request
    httpMock.expectOne(service.baseApiUrl + '/LovType/findAllLovType').flush({ data: [] });
  });
});
