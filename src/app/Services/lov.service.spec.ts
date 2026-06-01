import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LovService } from './lov.service';
import { of, throwError } from 'rxjs';

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
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should cache categories after the first call', () => {
    const mockResponse = { data: [[{ lovTypeId: 1, title: 'Test' }]] };

    service.getCategories().subscribe();
    const req1 = httpMock.expectOne(service.baseApiUrl + '/LovType/findAllLovType');
    req1.flush(mockResponse);

    // Second call should not trigger a new request
    service.getCategories().subscribe();
    httpMock.expectNone(service.baseApiUrl + '/LovType/findAllLovType');
  });

  it('should cache LOVs for different IDs independently', () => {
    const mockResponse1 = { data: [[{ lovId: 101, title: 'Item 1' }]] };
    const mockResponse2 = { data: [[{ lovId: 201, title: 'Item 2' }]] };

    service.getListOfValues(1).subscribe();
    const req1 = httpMock.expectOne(`${service.baseApiUrl}/lov/findAlllov`);
    req1.flush(mockResponse1);

    service.getListOfValues(2).subscribe();
    const req2 = httpMock.expectOne(`${service.baseApiUrl}/lov/findAlllov`);
    req2.flush(mockResponse2);

    // Recalling ID 1 should be cached
    service.getListOfValues(1).subscribe();
    httpMock.expectNone(`${service.baseApiUrl}/lov/findAlllov`);
  });

  it('should clear cache when addlov is called', () => {
    service.getCategories().subscribe();
    httpMock.expectOne(service.baseApiUrl + '/LovType/findAllLovType').flush({});

    service.addlov({}).subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/lov/addlov`).flush({});

    // Cache should be empty, so next call triggers request
    service.getCategories().subscribe();
    httpMock.expectOne(service.baseApiUrl + '/LovType/findAllLovType');
  });

  it('should reset cache entry if request fails', () => {
    service.getCategories().subscribe({ error: () => {} });
    const req1 = httpMock.expectOne(service.baseApiUrl + '/LovType/findAllLovType');
    req1.error(new ErrorEvent('Network error'));

    // Next call should retry because first one failed
    service.getCategories().subscribe();
    httpMock.expectOne(service.baseApiUrl + '/LovType/findAllLovType');
  });
});
