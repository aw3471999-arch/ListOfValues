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

  it('should cache getCategories response', () => {
    const mockData = { data: [[{ lovTypeId: 1, title: 'Test' }]] };

    // First call
    service.getCategories().subscribe(data => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(service.baseApiUrl + '/LovType/findAllLovType');
    expect(req.request.method).toBe('POST');
    req.flush(mockData);

    // Second call - should not trigger another HTTP request
    service.getCategories().subscribe(data => {
      expect(data).toEqual(mockData);
    });

    httpMock.expectNone(service.baseApiUrl + '/LovType/findAllLovType');
  });

  it('should cache getListOfValues response by lovTypeId', () => {
    const lovTypeId = 101;
    const mockData = { data: [[{ lovId: 1, title: 'Value 1' }]] };

    // First call
    service.getListOfValues(lovTypeId).subscribe(data => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${service.baseApiUrl}/lov/findAlllov`);
    expect(req.request.body.data[0].lovTypeId).toBe(lovTypeId);
    req.flush(mockData);

    // Second call with same ID - should be cached
    service.getListOfValues(lovTypeId).subscribe(data => {
      expect(data).toEqual(mockData);
    });
    httpMock.expectNone(`${service.baseApiUrl}/lov/findAlllov`);

    // Call with different ID - should trigger new request
    const otherId = 102;
    service.getListOfValues(otherId).subscribe();
    const req2 = httpMock.expectOne(`${service.baseApiUrl}/lov/findAlllov`);
    expect(req2.request.body.data[0].lovTypeId).toBe(otherId);
    req2.flush(mockData);
  });

  it('should clear cache when addlov is called', () => {
    // Fill cache
    service.getCategories().subscribe();
    httpMock.expectOne(service.baseApiUrl + '/LovType/findAllLovType').flush({});

    // Call addlov
    service.addlov({ title: 'New' }).subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/lov/addlov`).flush({});

    // Call getCategories again - should trigger new request
    service.getCategories().subscribe();
    httpMock.expectOne(service.baseApiUrl + '/LovType/findAllLovType');
  });

  it('should clear cache when logout is called', () => {
    // Fill cache
    service.getCategories().subscribe();
    httpMock.expectOne(service.baseApiUrl + '/LovType/findAllLovType').flush({});

    // Logout
    service.logout();

    // Call getCategories again - should trigger new request
    service.getCategories().subscribe();
    httpMock.expectOne(service.baseApiUrl + '/LovType/findAllLovType');
  });
});
