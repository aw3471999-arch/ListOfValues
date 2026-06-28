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

  it('should cache getCategories results', () => {
    const mockResponse = { data: [[{ lovTypeId: 1, title: 'Test' }]] };

    // First call
    service.getCategories().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    // Second call - should not trigger a new HTTP request
    service.getCategories().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    httpMock.expectNone(`${service.baseApiUrl}/LovType/findAllLovType`);
  });

  it('should cache getListOfValues results by ID', () => {
    const mockResponse1 = { data: [[{ lovId: 101, title: 'Item 1' }]] };
    const mockResponse2 = { data: [[{ lovId: 201, title: 'Item 2' }]] };

    // Call for ID 1
    service.getListOfValues(1).subscribe(res => expect(res).toEqual(mockResponse1));
    const req1 = httpMock.expectOne(`${service.baseApiUrl}/lov/findAlllov`);
    req1.flush(mockResponse1);

    // Call for ID 1 again - cached
    service.getListOfValues(1).subscribe(res => expect(res).toEqual(mockResponse1));
    httpMock.expectNone(`${service.baseApiUrl}/lov/findAlllov`);

    // Call for ID 2 - new request
    service.getListOfValues(2).subscribe(res => expect(res).toEqual(mockResponse2));
    const req2 = httpMock.expectOne(`${service.baseApiUrl}/lov/findAlllov`);
    req2.flush(mockResponse2);
  });

  it('should clear cache on addlov', () => {
    const mockResponse = { data: [[{ lovTypeId: 1, title: 'Test' }]] };

    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`).flush(mockResponse);

    // Call addlov
    service.addlov({ title: 'New' }).subscribe();
    const addReq = httpMock.expectOne(`${service.baseApiUrl}/lov/addlov`);
    addReq.flush({ success: true });

    // Next getCategories should trigger new request
    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`);
  });

  it('should clear cache on deletelov', () => {
    const mockResponse = { data: [[{ lovTypeId: 1, title: 'Test' }]] };

    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`).flush(mockResponse);

    // Call deletelov
    service.deletelov(101).subscribe();
    const delReq = httpMock.expectOne(`${service.baseApiUrl}/lov/deletelov`);
    delReq.flush({ success: true });

    // Next getCategories should trigger new request
    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`);
  });
});
