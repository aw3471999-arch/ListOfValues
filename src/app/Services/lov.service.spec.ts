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

  it('should cache getCategories results', () => {
    const mockResponse = { data: [[{ lovTypeId: 1, title: 'Test' }]] };

    // First call
    service.getCategories().subscribe();
    const req1 = httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`);
    req1.flush(mockResponse);

    // Second call - should not trigger a new request
    service.getCategories().subscribe(response => {
      expect(response).toEqual(mockResponse);
    });
    httpMock.expectNone(`${service.baseApiUrl}/LovType/findAllLovType`);
  });

  it('should cache getListOfValues results by ID', () => {
    const mockResponse = { data: [[{ lovId: 101, title: 'Item' }]] };

    // First call for ID 1
    service.getListOfValues(1).subscribe();
    const req1 = httpMock.expectOne(`${service.baseApiUrl}/lov/findAlllov`);
    req1.flush(mockResponse);

    // Second call for ID 1 - should be cached
    service.getListOfValues(1).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });
    httpMock.expectNone(`${service.baseApiUrl}/lov/findAlllov`);

    // Call for ID 2 - should trigger new request
    service.getListOfValues(2).subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/lov/findAlllov`);
  });

  it('should clear cache when addlov is called', () => {
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

  it('should clear cache when deletelov is called', () => {
    // Fill cache
    service.getListOfValues(1).subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/lov/findAlllov`).flush({});

    // Call deletelov
    service.deletelov(101).subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/lov/deletelov`).flush({});

    // Next getListOfValues should trigger new request
    service.getListOfValues(1).subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/lov/findAlllov`);
  });

  it('should not cache errors', () => {
    // Call triggers error
    service.getCategories().subscribe({
      error: () => {}
    });
    const req1 = httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`);
    req1.error(new ErrorEvent('Network error'));

    // Next call should try again
    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`);
  });
});
