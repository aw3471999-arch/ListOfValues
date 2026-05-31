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

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should cache categories and reuse the same observable', () => {
    const mockResponse = { data: [[{ lovTypeId: 1, title: 'Test' }]] };

    // First call
    const obs1 = service.getCategories();
    obs1.subscribe();

    const req1 = httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`);
    expect(req1.request.method).toBe('POST');
    req1.flush(mockResponse);

    // Second call - should not trigger a new request
    const obs2 = service.getCategories();
    obs2.subscribe();

    httpMock.expectNone(`${service.baseApiUrl}/LovType/findAllLovType`);
    expect(obs1).toBe(obs2);
  });

  it('should cache LOVs by lovTypeId and reuse the same observable', () => {
    const lovTypeId = 1;
    const mockResponse = { data: [[{ lovId: 1, title: 'Item 1' }]] };

    // First call
    const obs1 = service.getListOfValues(lovTypeId);
    obs1.subscribe();

    const req1 = httpMock.expectOne(`${service.baseApiUrl}/lov/findAlllov`);
    expect(req1.request.method).toBe('POST');
    expect(req1.request.body.data[0].lovTypeId).toBe(lovTypeId);
    req1.flush(mockResponse);

    // Second call - should not trigger a new request
    const obs2 = service.getListOfValues(lovTypeId);
    obs2.subscribe();

    httpMock.expectNone(`${service.baseApiUrl}/lov/findAlllov`);
    expect(obs1).toBe(obs2);
  });

  it('should clear cache on addlov', () => {
    const mockCategoriesResponse = { data: [[{ lovTypeId: 1, title: 'Test' }]] };

    // Fill cache
    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`).flush(mockCategoriesResponse);

    // Call addlov
    service.addlov({ title: 'New' }).subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/lov/addlov`).flush({ success: true });

    // Request categories again - should trigger a new request
    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`);
  });

  it('should clear cache on logout', () => {
    const mockCategoriesResponse = { data: [[{ lovTypeId: 1, title: 'Test' }]] };

    // Fill cache
    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`).flush(mockCategoriesResponse);

    // Call logout
    service.logout();

    // Request categories again - should trigger a new request
    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`);
  });

  it('should reset cache if an error occurs', () => {
    // First call - should fail
    service.getCategories().subscribe({
      error: () => {}
    });

    const req1 = httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`);
    req1.error(new ErrorEvent('Network error'));

    // Second call - should trigger a new request
    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`);
  });
});
