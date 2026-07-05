import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { LovService } from './lov.service';

describe('LovService', () => {
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

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should cache categories after first call', () => {
    const mockResponse = { data: [[{ lovTypeId: 1, title: 'Test Category' }]] };

    // First call
    service.getCategories().subscribe();
    const req1 = httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`);
    expect(req1.request.method).toBe('POST');
    req1.flush(mockResponse);

    // Second call - should not trigger a new request
    service.getCategories().subscribe();
    httpMock.expectNone(`${service.baseApiUrl}/LovType/findAllLovType`);
  });

  it('should clear cache and trigger new request after addlov', () => {
    const mockResponse = { data: [[{ lovTypeId: 1, title: 'Test Category' }]] };

    // Initial call to fill cache
    service.getCategories().subscribe();
    const req1 = httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`);
    req1.flush(mockResponse);

    // Call addlov
    service.addlov({ title: 'New' }).subscribe();
    const addReq = httpMock.expectOne(`${service.baseApiUrl}/lov/addlov`);
    addReq.flush({ success: true });

    // Call getCategories again - should trigger a new request
    service.getCategories().subscribe();
    const req2 = httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`);
    req2.flush(mockResponse);
  });

  it('should cache LOV items by lovTypeId', () => {
    const mockResponse = { data: [[{ lovId: 1, title: 'Item 1' }]] };

    // First call for type 1
    service.getListOfValues(1).subscribe();
    const req1 = httpMock.expectOne(`${service.baseApiUrl}/lov/findAlllov`);
    req1.flush(mockResponse);

    // Second call for type 1 - cached
    service.getListOfValues(1).subscribe();
    httpMock.expectNone(`${service.baseApiUrl}/lov/findAlllov`);

    // First call for type 2 - new request
    service.getListOfValues(2).subscribe();
    const req2 = httpMock.expectOne(`${service.baseApiUrl}/lov/findAlllov`);
    req2.flush(mockResponse);
  });
});
