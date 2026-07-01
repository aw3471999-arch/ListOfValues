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

  it('should cache categories and only make one HTTP request', () => {
    const mockCategories = { data: [[[{ lovTypeId: 1, title: 'Test' }]]] };

    // First call
    service.getCategories().subscribe(res => {
      expect(res).toEqual(mockCategories);
    });

    const req = httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`);
    expect(req.request.method).toBe('POST');
    req.flush(mockCategories);

    // Second call - should return cached value without new request
    service.getCategories().subscribe(res => {
      expect(res).toEqual(mockCategories);
    });

    httpMock.expectNone(`${service.baseApiUrl}/LovType/findAllLovType`);
  });

  it('should cache LOV items for different IDs separately', () => {
    const mockLov1 = { data: [[[{ lovId: 101, title: 'Item 1' }]]] };
    const mockLov2 = { data: [[[{ lovId: 201, title: 'Item 2' }]]] };

    // Request for ID 1
    service.getListOfValues(1).subscribe(res => expect(res).toEqual(mockLov1));
    const req1 = httpMock.expectOne(`${service.baseApiUrl}/lov/findAlllov`);
    req1.flush(mockLov1);

    // Request for ID 2
    service.getListOfValues(2).subscribe(res => expect(res).toEqual(mockLov2));
    const req2 = httpMock.expectOne(`${service.baseApiUrl}/lov/findAlllov`);
    req2.flush(mockLov2);

    // Repeated request for ID 1 - should be cached
    service.getListOfValues(1).subscribe(res => expect(res).toEqual(mockLov1));
    httpMock.expectNone(`${service.baseApiUrl}/lov/findAlllov`);
  });

  it('should clear cache on logout', () => {
    const mockCategories = { data: [[[{ lovTypeId: 1, title: 'Test' }]]] };

    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`).flush(mockCategories);

    service.logout();

    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`);
  });
});
