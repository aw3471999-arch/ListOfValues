import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { LovService } from './lov.service';
import { provideHttpClient } from '@angular/common/http';

describe('LovService Caching', () => {
  let service: LovService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LovService,
        provideHttpClient(),
        provideHttpClientTesting()
      ],
    });
    service = TestBed.inject(LovService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should cache categories and not call API twice', () => {
    const mockResponse = { data: [[{ lovTypeId: 1, title: 'Category 1' }]] };

    service.getCategories().subscribe();
    const req = httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    // Second call should be cached
    service.getCategories().subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });
    httpMock.expectNone(`${service.baseApiUrl}/LovType/findAllLovType`);
  });

  it('should cache LOVs by ID and not call API twice for same ID', () => {
    const lovTypeId = 1;
    const mockResponse = { data: [[{ lovId: 1, title: 'LOV 1' }]] };

    service.getListOfValues(lovTypeId).subscribe();
    const req = httpMock.expectOne(`${service.baseApiUrl}/lov/findAlllov`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.data[0].lovTypeId).toBe(lovTypeId);
    req.flush(mockResponse);

    // Second call for same ID should be cached
    service.getListOfValues(lovTypeId).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });
    httpMock.expectNone(`${service.baseApiUrl}/lov/findAlllov`);
  });

  it('should clear cache when clearCache() is called', () => {
    const mockResponse = { data: [[{ lovTypeId: 1, title: 'Category 1' }]] };

    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`).flush(mockResponse);

    service.clearCache();

    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`);
  });

  it('should invalidate cache on addlov', () => {
    const mockResponse = { data: [[{ lovTypeId: 1, title: 'Category 1' }]] };
    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`).flush(mockResponse);

    service.addlov({ title: 'New LOV' }).subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/lov/addlov`).flush({ success: true });

    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`);
  });

  it('should invalidate cache on deletelov', () => {
    const mockResponse = { data: [[{ lovTypeId: 1, title: 'Category 1' }]] };
    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`).flush(mockResponse);

    service.deletelov(1).subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/lov/deletelov`).flush({ success: true });

    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`);
  });

  it('should invalidate cache on logout', () => {
    const mockResponse = { data: [[{ lovTypeId: 1, title: 'Category 1' }]] };
    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`).flush(mockResponse);

    service.logout();

    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`);
  });

  it('should not cache errors for categories', () => {
    service.getCategories().subscribe({ error: () => {} });
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`).error(new ProgressEvent('error'));

    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`);
  });

  it('should not cache errors for LOVs', () => {
    const lovTypeId = 1;
    service.getListOfValues(lovTypeId).subscribe({ error: () => {} });
    httpMock.expectOne(`${service.baseApiUrl}/lov/findAlllov`).error(new ProgressEvent('error'));

    service.getListOfValues(lovTypeId).subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/lov/findAlllov`);
  });
});
