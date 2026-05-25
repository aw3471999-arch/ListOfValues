import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
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
      ]
    });
    service = TestBed.inject(LovService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should cache categories after the first call', () => {
    const mockData = { data: [[{ lovTypeId: 1, title: 'Test' }]] };

    service.getCategories().subscribe();
    const req1 = httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`);
    expect(req1.request.method).toBe('POST');
    req1.flush(mockData);

    // Second call should NOT trigger a new HTTP request
    service.getCategories().subscribe(data => {
      expect(data).toEqual(mockData);
    });
    httpMock.expectNone(`${service.baseApiUrl}/LovType/findAllLovType`);
  });

  it('should cache list of values by ID', () => {
    const mockData = { data: [[{ lovId: 101, title: 'Item 1' }]] };
    const typeId = 1;

    service.getListOfValues(typeId).subscribe();
    const req1 = httpMock.expectOne(`${service.baseApiUrl}/lov/findAlllov`);
    req1.flush(mockData);

    // Second call for same ID should be cached
    service.getListOfValues(typeId).subscribe();
    httpMock.expectNone(`${service.baseApiUrl}/lov/findAlllov`);

    // Different ID should trigger new request
    service.getListOfValues(2).subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/lov/findAlllov`);
  });

  it('should clear cache on logout', () => {
    service.getCategories().subscribe();
    const req1 = httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`);
    req1.flush({});

    service.logout();

    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`);
  });

  it('should clear cache on adding a new LOV', () => {
    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`).flush({});

    service.addlov({ title: 'New' }).subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/lov/addlov`).flush({});

    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`);
  });
});
