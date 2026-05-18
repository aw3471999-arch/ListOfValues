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
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should cache categories after the first call', () => {
    const mockCategories = { data: [[{ lovTypeId: 1, title: 'Category 1' }]] };

    // First call
    service.getCategories().subscribe();
    const req1 = httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`);
    req1.flush(mockCategories);

    // Second call - should NOT trigger a new request
    service.getCategories().subscribe();
    httpMock.expectNone(`${service.baseApiUrl}/LovType/findAllLovType`);
  });

  it('should cache LOVs for the same ID', () => {
    const lovTypeId = 1;
    const mockLovs = { data: [[{ lovId: 101, title: 'LOV 1' }]] };

    // First call
    service.getListOfValues(lovTypeId).subscribe();
    const req1 = httpMock.expectOne(`${service.baseApiUrl}/lov/findAlllov`);
    req1.flush(mockLovs);

    // Second call with same ID - should NOT trigger a new request
    service.getListOfValues(lovTypeId).subscribe();
    httpMock.expectNone(`${service.baseApiUrl}/lov/findAlllov`);

    // Call with DIFFERENT ID - SHOULD trigger a new request
    service.getListOfValues(2).subscribe();
    const req2 = httpMock.expectOne(`${service.baseApiUrl}/lov/findAlllov`);
    req2.flush({ data: [] });
  });

  it('should clear cache on addlov', () => {
    const mockCategories = { data: [[{ lovTypeId: 1, title: 'Category 1' }]] };

    // Seed cache
    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`).flush(mockCategories);

    // addlov should clear cache
    service.addlov({ title: 'New' }).subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/lov/addlov`).flush({});

    // Next getCategories should trigger new request
    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`).flush(mockCategories);
  });

  it('should clear cache on deletelov', () => {
    const mockCategories = { data: [[{ lovTypeId: 1, title: 'Category 1' }]] };

    // Seed cache
    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`).flush(mockCategories);

    // deletelov should clear cache
    service.deletelov(101).subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/lov/deletelov`).flush({});

    // Next getCategories should trigger new request
    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`).flush(mockCategories);
  });

  it('should clear cache on logout', () => {
    const mockCategories = { data: [[{ lovTypeId: 1, title: 'Category 1' }]] };

    // Seed cache
    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`).flush(mockCategories);

    // logout should clear cache
    service.logout();

    // Next getCategories should trigger new request
    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`).flush(mockCategories);
  });
});
