import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LovService } from './lov.service';
import { of } from 'rxjs';

describe('LovService', () => {
  let service: LovService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LovService],
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
    const mockResponse = { data: [[{ lovTypeId: 1, title: 'Category 1' }]] };

    service.getCategories().subscribe();
    const req1 = httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`);
    expect(req1.request.method).toBe('POST');
    req1.flush(mockResponse);

    // Second call should be cached
    service.getCategories().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    httpMock.expectNone(`${service.baseApiUrl}/LovType/findAllLovType`);
  });

  it('should cache getListOfValues results by lovTypeId', () => {
    const lovTypeId = 1;
    const mockResponse = { data: [[{ lovId: 101, title: 'Value 1' }]] };

    service.getListOfValues(lovTypeId).subscribe();
    const req1 = httpMock.expectOne(`${service.baseApiUrl}/lov/findAlllov`);
    expect(req1.request.method).toBe('POST');
    expect(req1.request.body.data[0].lovTypeId).toBe(lovTypeId);
    req1.flush(mockResponse);

    // Second call with same ID should be cached
    service.getListOfValues(lovTypeId).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    httpMock.expectNone(`${service.baseApiUrl}/lov/findAlllov`);

    // Call with different ID should trigger new request
    service.getListOfValues(2).subscribe();
    const req2 = httpMock.expectOne(`${service.baseApiUrl}/lov/findAlllov`);
    req2.flush({ data: [[]] });
  });

  it('should invalidate cache when addlov is called', () => {
    const mockResponse = { data: [[{ lovTypeId: 1, title: 'Category 1' }]] };

    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`).flush(mockResponse);

    // Call addlov
    service.addlov({ title: 'New' }).subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/lov/addlov`).flush({ status: 'success' });

    // Next getCategories should trigger new request
    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`);
  });

  it('should invalidate cache when deletelov is called', () => {
    const mockResponse = { data: [[{ lovTypeId: 1, title: 'Category 1' }]] };

    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`).flush(mockResponse);

    // Call deletelov
    service.deletelov(101).subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/lov/deletelov`).flush({ status: 'success' });

    // Next getCategories should trigger new request
    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`);
  });

  it('should invalidate cache when logout is called', () => {
    const mockResponse = { data: [[{ lovTypeId: 1, title: 'Category 1' }]] };

    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`).flush(mockResponse);

    // Call logout
    service.logout();

    // Next getCategories should trigger new request
    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`);
  });

  it('should clear cache on error', () => {
    service.getCategories().subscribe({
      error: () => {}
    });

    const req1 = httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`);
    req1.error(new ErrorEvent('Network error'));

    // Next call should retry since cache was cleared on error
    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`);
  });
});
