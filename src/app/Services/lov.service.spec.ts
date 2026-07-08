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

  it('should cache getCategories and only make one HTTP request', () => {
    const dummyResponse = { data: [[{ lovTypeId: 1, title: 'Category 1' }]] };

    service.getCategories().subscribe();
    service.getCategories().subscribe();

    const req = httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`);
    expect(req.request.method).toBe('POST');
    req.flush(dummyResponse);

    // Subsequent call should not trigger another request
    service.getCategories().subscribe();
    httpMock.expectNone(`${service.baseApiUrl}/LovType/findAllLovType`);
  });

  it('should cache getListOfValues for same lovTypeId and only make one HTTP request', () => {
    const lovTypeId = 1;
    const dummyResponse = { data: [[{ lovId: 101, title: 'Value 1' }]] };

    service.getListOfValues(lovTypeId).subscribe();
    service.getListOfValues(lovTypeId).subscribe();

    const req = httpMock.expectOne(`${service.baseApiUrl}/lov/findAlllov`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.data[0].lovTypeId).toBe(lovTypeId);
    req.flush(dummyResponse);

    // Subsequent call for same ID should not trigger another request
    service.getListOfValues(lovTypeId).subscribe();
    httpMock.expectNone(`${service.baseApiUrl}/lov/findAlllov`);
  });

  it('should clear cache and trigger new requests after clearCache is called', () => {
    const dummyResponse = { data: [[]] };

    service.getCategories().subscribe();
    const req1 = httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`);
    req1.flush(dummyResponse);

    service.clearCache();

    service.getCategories().subscribe();
    const req2 = httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`);
    req2.flush(dummyResponse);
  });

  it('should clear cache after addlov is called', () => {
    const dummyResponse = { data: [[]] };

    // Initial fetch to populate cache
    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`).flush(dummyResponse);

    // Call addlov
    service.addlov({ title: 'New Item' }).subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/lov/addlov`).flush(dummyResponse);

    // Fetch again - should trigger new request
    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`).flush(dummyResponse);
  });
});
