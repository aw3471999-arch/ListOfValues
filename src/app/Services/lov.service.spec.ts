import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LovService } from './lov.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('LovService', () => {
  let service: LovService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [LovService]
    });
    service = TestBed.inject(LovService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should cache getCategories results', () => {
    const mockResponse = { data: [[{ lovTypeId: 1, title: 'Test' }]] };

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

  it('should cache getListOfValues results by lovTypeId', () => {
    const lovTypeId = 1;
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

    // Call for different ID should trigger new request
    const secondLovTypeId = 2;
    service.getListOfValues(secondLovTypeId).subscribe();
    const req2 = httpMock.expectOne(`${service.baseApiUrl}/lov/findAlllov`);
    expect(req2.request.body.data[0].lovTypeId).toBe(secondLovTypeId);
    req2.flush({ data: [[]] });
  });

  it('should clear cache on addlov', () => {
    // Fill cache
    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`).flush({});

    // Call addlov
    service.addlov({ title: 'New' }).subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/lov/addlov`).flush({});

    // Next getCategories should trigger new request
    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`);
  });

  it('should clear cache on deletelov', () => {
    // Fill cache
    service.getListOfValues(1).subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/lov/findAlllov`).flush({});

    // Call deletelov
    service.deletelov(1).subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/lov/deletelov`).flush({});

    // Next getListOfValues should trigger new request
    service.getListOfValues(1).subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/lov/findAlllov`);
  });

  it('should clear cache on logout', () => {
    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`).flush({});

    service.logout();

    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`);
  });
});
