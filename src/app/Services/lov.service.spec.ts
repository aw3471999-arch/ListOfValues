import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
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

    const req = httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    // Second call - should not trigger a new request
    service.getCategories().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    httpMock.expectNone(`${service.baseApiUrl}/LovType/findAllLovType`);
  });

  it('should cache getListOfValues results per lovTypeId', () => {
    const mockResponse1 = { data: [[{ lovId: 1, title: 'Item 1' }]] };
    const mockResponse2 = { data: [[{ lovId: 2, title: 'Item 2' }]] };

    // Call for lovTypeId 1
    service.getListOfValues(1).subscribe(res => expect(res).toEqual(mockResponse1));
    const req1 = httpMock.expectOne(`${service.baseApiUrl}/lov/findAlllov`);
    req1.flush(mockResponse1);

    // Call for lovTypeId 2
    service.getListOfValues(2).subscribe(res => expect(res).toEqual(mockResponse2));
    const req2 = httpMock.expectOne(`${service.baseApiUrl}/lov/findAlllov`);
    req2.flush(mockResponse2);

    // Repeat calls - should be cached
    service.getListOfValues(1).subscribe(res => expect(res).toEqual(mockResponse1));
    service.getListOfValues(2).subscribe(res => expect(res).toEqual(mockResponse2));

    httpMock.expectNone(`${service.baseApiUrl}/lov/findAlllov`);
  });

  it('should invalidate cache on addlov', () => {
    const mockResponse = { data: [] };

    // Fill cache
    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`).flush(mockResponse);

    // Mutate
    service.addlov({ title: 'New' }).subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/lov/addlov`).flush({ success: true });

    // Next call should trigger new request
    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`);
  });

  it('should invalidate cache on deletelov', () => {
    const mockResponse = { data: [] };

    // Fill cache
    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`).flush(mockResponse);

    // Mutate
    service.deletelov(1).subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/lov/deletelov`).flush({ success: true });

    // Next call should trigger new request
    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`);
  });

  it('should reset cache if an error occurs', () => {
    // First call fails
    service.getCategories().subscribe({
      error: (err) => expect(err).toBeTruthy()
    });

    const req1 = httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`);
    req1.error(new ProgressEvent('error'));

    // Second call should try again
    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`);
  });
});
