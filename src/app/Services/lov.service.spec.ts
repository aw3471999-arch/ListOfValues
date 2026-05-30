import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
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

  it('should cache categories after the first call', () => {
    const mockCategories = { data: [[{ lovTypeId: 1, title: 'Cat 1' }]] };

    // First call
    service.getCategories().subscribe(res => {
      expect(res).toEqual(mockCategories);
    });

    const req = httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`);
    expect(req.request.method).toBe('POST');
    req.flush(mockCategories);

    // Second call - should not trigger a new HTTP request
    service.getCategories().subscribe(res => {
      expect(res).toEqual(mockCategories);
    });

    httpMock.expectNone(`${service.baseApiUrl}/LovType/findAllLovType`);
  });

  it('should cache LOVs by lovTypeId', () => {
    const mockLovs = { data: [[{ lovId: 1, title: 'LOV 1' }]] };
    const lovTypeId = 10;

    // First call
    service.getListOfValues(lovTypeId).subscribe(res => {
      expect(res).toEqual(mockLovs);
    });

    const req = httpMock.expectOne(`${service.baseApiUrl}/lov/findAlllov`);
    expect(req.request.body.data[0].lovTypeId).toBe(lovTypeId);
    req.flush(mockLovs);

    // Second call for same ID - should be cached
    service.getListOfValues(lovTypeId).subscribe(res => {
      expect(res).toEqual(mockLovs);
    });

    httpMock.expectNone(`${service.baseApiUrl}/lov/findAlllov`);
  });

  it('should invalidate cache when addlov is called', () => {
    // Fill cache
    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`).flush({});

    // Call addlov
    service.addlov({ title: 'New' }).subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/lov/addlov`).flush({});

    // Next call to getCategories should trigger new HTTP request
    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`);
  });

  it('should clear cache on logout', () => {
    // Fill cache
    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`).flush({});

    service.logout();

    // Next call should trigger new HTTP request
    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`);
  });

  it('should reset cache if an error occurs', () => {
    // First call fails
    service.getCategories().subscribe({
      error: () => {}
    });
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`).error(new ErrorEvent('Network error'));

    // Second call should try again (not cached error)
    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`);
  });
});
