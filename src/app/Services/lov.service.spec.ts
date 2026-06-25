import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
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
      ],
    });
    service = TestBed.inject(LovService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should cache getCategories response', () => {
    const mockData = { data: [[{ lovTypeId: 1, title: 'Test' }]] };

    service.getCategories().subscribe();
    const req = httpMock.expectOne(service.baseApiUrl + '/LovType/findAllLovType');
    expect(req.request.method).toBe('POST');
    req.flush(mockData);

    // Second call should not trigger a new request
    service.getCategories().subscribe(data => {
      expect(data).toEqual(mockData);
    });
    httpMock.expectNone(service.baseApiUrl + '/LovType/findAllLovType');
  });

  it('should cache getListOfValues response by lovTypeId', () => {
    const mockData = { data: [[{ lovId: 1, title: 'Value' }]] };
    const lovTypeId = 1;

    service.getListOfValues(lovTypeId).subscribe();
    const req = httpMock.expectOne(`${service.baseApiUrl}/lov/findAlllov`);
    req.flush(mockData);

    // Second call with same ID should be cached
    service.getListOfValues(lovTypeId).subscribe(data => {
      expect(data).toEqual(mockData);
    });
    httpMock.expectNone(`${service.baseApiUrl}/lov/findAlllov`);

    // Call with different ID should trigger a new request
    service.getListOfValues(2).subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/lov/findAlllov`);
  });

  it('should clear cache on addlov', () => {
    const mockData = { data: [] };
    service.getCategories().subscribe();
    httpMock.expectOne(service.baseApiUrl + '/LovType/findAllLovType').flush(mockData);

    service.addlov({ title: 'New' }).subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/lov/addlov`).flush({ success: true });

    // Next call should trigger a new request
    service.getCategories().subscribe();
    httpMock.expectOne(service.baseApiUrl + '/LovType/findAllLovType');
  });

  it('should reset cache on HTTP error', () => {
    service.getCategories().subscribe({ error: () => {} });
    const req = httpMock.expectOne(service.baseApiUrl + '/LovType/findAllLovType');
    req.error(new ErrorEvent('Network error'));

    // Next call should trigger a new request because the first one failed
    service.getCategories().subscribe();
    httpMock.expectOne(service.baseApiUrl + '/LovType/findAllLovType');
  });
});
