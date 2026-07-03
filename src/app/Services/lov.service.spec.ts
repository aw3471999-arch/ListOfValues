import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LovService } from './lov.service';

describe('LovService', () => {
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
    const mockResponse = { data: [[{ lovTypeId: 1, title: 'Test' }]] };

    // First call
    service.getCategories().subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    // Second call - should not trigger a new request
    service.getCategories().subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    httpMock.expectNone(`${service.baseApiUrl}/LovType/findAllLovType`);
  });

  it('should cache LOV items by lovTypeId', () => {
    const lovTypeId = 1;
    const mockResponse = { data: [[{ lovId: 101, title: 'Item 1' }]] };

    // First call
    service.getListOfValues(lovTypeId).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service.baseApiUrl}/lov/findAlllov`);
    expect(req.request.body.data[0].lovTypeId).toBe(lovTypeId);
    req.flush(mockResponse);

    // Second call for same ID - should be cached
    service.getListOfValues(lovTypeId).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    httpMock.expectNone(`${service.baseApiUrl}/lov/findAlllov`);
  });

  it('should invalidate cache when adding a new LOV', () => {
    const mockCategories = { data: [[{ lovTypeId: 1 }]] };

    // Fill cache
    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`).flush(mockCategories);

    // Add LOV
    service.addlov({ title: 'New' }).subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/lov/addlov`).flush({ status: 'success' });

    // Call categories again - should trigger new request
    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`);
  });

  it('should invalidate cache when deleting an LOV', () => {
    const lovTypeId = 1;
    const mockLovs = { data: [[{ lovId: 101 }]] };

    // Fill cache
    service.getListOfValues(lovTypeId).subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/lov/findAlllov`).flush(mockLovs);

    // Delete LOV
    service.deletelov(101).subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/lov/deletelov`).flush({ status: 'success' });

    // Call LOV list again - should trigger new request
    service.getListOfValues(lovTypeId).subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/lov/findAlllov`);
  });

  it('should reset cache on logout', () => {
    const mockCategories = { data: [[{ lovTypeId: 1 }]] };

    // Fill cache
    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`).flush(mockCategories);

    // Logout
    service.logout();

    // Call categories again - should trigger new request
    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`);
  });

  it('should not cache errors', () => {
    // First call fails
    service.getCategories().subscribe({
      error: (err) => expect(err.status).toBe(500)
    });
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`).flush('Error', { status: 500, statusText: 'Server Error' });

    // Second call should trigger a new request
    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`).flush({ data: [[{ lovTypeId: 1 }]] });
  });
});
