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

  it('should cache categories after the first call', () => {
    const mockResponse = { data: [[{ lovTypeId: 1, title: 'Test' }]] };

    service.getCategories().subscribe();
    const req1 = httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`);
    req1.flush(mockResponse);

    // Second call should not trigger a new HTTP request
    service.getCategories().subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });
    httpMock.expectNone(`${service.baseApiUrl}/LovType/findAllLovType`);
  });

  it('should cache LOV items by ID', () => {
    const lovTypeId = 1;
    const mockResponse = { data: [[{ lovId: 1, title: 'Item 1' }]] };

    service.getListOfValues(lovTypeId).subscribe();
    const req1 = httpMock.expectOne(`${service.baseApiUrl}/lov/findAlllov`);
    req1.flush(mockResponse);

    // Second call with same ID should not trigger a new request
    service.getListOfValues(lovTypeId).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });
    httpMock.expectNone(`${service.baseApiUrl}/lov/findAlllov`);

    // Call with different ID should trigger a new request
    service.getListOfValues(2).subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/lov/findAlllov`);
  });

  it('should clear cache when addlov is called', () => {
    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`).flush({});

    service.addlov({ title: 'New' }).subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/lov/addlov`).flush({});

    // Next call to getCategories should trigger a new request
    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`);
  });

  it('should clear cache on logout', () => {
    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`).flush({});

    service.logout();

    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`);
  });
});
