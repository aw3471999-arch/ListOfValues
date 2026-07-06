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

  it('should cache categories', () => {
    const mockResponse = { data: [[{ lovTypeId: 1, title: 'Test' }]] };

    service.getCategories().subscribe();
    const req = httpMock.expectOne(service.baseApiUrl + '/LovType/findAllLovType');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    // Second call should not trigger a new request
    service.getCategories().subscribe();
    httpMock.expectNone(service.baseApiUrl + '/LovType/findAllLovType');
  });

  it('should cache LOV items by type', () => {
    const lovTypeId = 1;
    const mockResponse = { data: [[{ lovId: 10, title: 'Item 1' }]] };

    service.getListOfValues(lovTypeId).subscribe();
    const req = httpMock.expectOne(`${service.baseApiUrl}/lov/findAlllov`);
    expect(req.request.body.data[0].lovTypeId).toBe(lovTypeId);
    req.flush(mockResponse);

    // Second call for same ID should be cached
    service.getListOfValues(lovTypeId).subscribe();
    httpMock.expectNone(`${service.baseApiUrl}/lov/findAlllov`);

    // Call for different ID should trigger new request
    service.getListOfValues(2).subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/lov/findAlllov`).flush(mockResponse);
  });

  it('should clear cache on addlov', () => {
    service.getCategories().subscribe();
    httpMock.expectOne(service.baseApiUrl + '/LovType/findAllLovType').flush({});

    service.addlov({ title: 'New' }).subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/lov/addlov`).flush({});

    // Cache should be empty, so next call triggers request
    service.getCategories().subscribe();
    httpMock.expectOne(service.baseApiUrl + '/LovType/findAllLovType');
  });

  it('should clear cache on deletelov', () => {
    service.getListOfValues(1).subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/lov/findAlllov`).flush({});

    service.deletelov(10).subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/lov/deletelov`).flush({});

    // Cache should be empty
    service.getListOfValues(1).subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/lov/findAlllov`);
  });

  it('should reset cache on error', () => {
    service.getCategories().subscribe({
      error: () => {}
    });
    httpMock.expectOne(service.baseApiUrl + '/LovType/findAllLovType').error(new ErrorEvent('error'));

    // Should retry request since first failed
    service.getCategories().subscribe();
    httpMock.expectOne(service.baseApiUrl + '/LovType/findAllLovType');
  });
});
