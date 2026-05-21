import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LovService } from './lov.service';
import { of } from 'rxjs';

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

  it('should cache categories after the first call', () => {
    const mockResponse = { data: [[{ lovTypeId: 1, title: 'Cat 1' }]] };

    // First call
    service.getCategories().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    // Second call should not trigger another HTTP request
    service.getCategories().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    httpMock.expectNone(`${service.baseApiUrl}/LovType/findAllLovType`);
  });

  it('should cache LOVs for the same lovTypeId', () => {
    const lovTypeId = 123;
    const mockResponse = { data: [[{ lovId: 1, title: 'Item 1' }]] };

    // First call
    service.getListOfValues(lovTypeId).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service.baseApiUrl}/lov/findAlllov`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.data[0].lovTypeId).toBe(lovTypeId);
    req.flush(mockResponse);

    // Second call for same ID should be cached
    service.getListOfValues(lovTypeId).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    httpMock.expectNone(`${service.baseApiUrl}/lov/findAlllov`);
  });

  it('should clear cache on addlov', () => {
    // Fill cache first
    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`).flush({});

    // Perform addlov
    service.addlov({ title: 'New' }).subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/lov/addlov`).flush({});

    // Next call should trigger new HTTP request
    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`);
  });

  it('should clear cache on deletelov', () => {
    // Fill cache first
    service.getListOfValues(1).subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/lov/findAlllov`).flush({});

    // Perform deletelov
    service.deletelov(100).subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/lov/deletelov`).flush({});

    // Next call should trigger new HTTP request
    service.getListOfValues(1).subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/lov/findAlllov`);
  });

  it('should clear cache on logout', () => {
    // Fill cache first
    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`).flush({});

    // Logout
    service.logout();

    // Next call should trigger new HTTP request
    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`);
  });
});
