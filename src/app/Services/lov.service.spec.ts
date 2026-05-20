import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LovService } from './lov.service';
import { of } from 'rxjs';

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

  it('should cache getCategories results', () => {
    const mockData = { data: [[{ lovTypeId: 1, title: 'Category 1' }]] };

    service.getCategories().subscribe();
    const req1 = httpMock.expectOne(service.baseApiUrl + '/LovType/findAllLovType');
    req1.flush(mockData);

    // Second call should return cached observable and NOT make another HTTP request
    service.getCategories().subscribe();
    httpMock.expectNone(service.baseApiUrl + '/LovType/findAllLovType');
  });

  it('should cache getListOfValues results by lovTypeId', () => {
    const mockData = { data: [[{ lovId: 1, title: 'Value 1' }]] };
    const lovTypeId = 123;

    service.getListOfValues(lovTypeId).subscribe();
    const req1 = httpMock.expectOne(`${service.baseApiUrl}/lov/findAlllov`);
    expect(req1.request.body.data[0].lovTypeId).toBe(lovTypeId);
    req1.flush(mockData);

    // Second call for same ID should be cached
    service.getListOfValues(lovTypeId).subscribe();
    httpMock.expectNone(`${service.baseApiUrl}/lov/findAlllov`);

    // Call for different ID should make a new request
    service.getListOfValues(456).subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/lov/findAlllov`).flush(mockData);
  });

  it('should clear cache on clearCache()', () => {
    const mockData = { data: [[{ id: 1 }]] };

    service.getCategories().subscribe();
    httpMock.expectOne(service.baseApiUrl + '/LovType/findAllLovType').flush(mockData);

    service.clearCache();

    service.getCategories().subscribe();
    httpMock.expectOne(service.baseApiUrl + '/LovType/findAllLovType').flush(mockData);
  });

  it('should clear cache on addlov', () => {
    service.getCategories().subscribe();
    httpMock.expectOne(service.baseApiUrl + '/LovType/findAllLovType').flush({data:[]});

    service.addlov({}).subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/lov/addlov`).flush({data:[]});

    service.getCategories().subscribe();
    httpMock.expectOne(service.baseApiUrl + '/LovType/findAllLovType').flush({data:[]});
  });

  it('should clear cache on deletelov', () => {
    service.getCategories().subscribe();
    httpMock.expectOne(service.baseApiUrl + '/LovType/findAllLovType').flush({data:[]});

    service.deletelov(1).subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/lov/deletelov`).flush({data:[]});

    service.getCategories().subscribe();
    httpMock.expectOne(service.baseApiUrl + '/LovType/findAllLovType').flush({data:[]});
  });

  it('should clear cache on logout', () => {
    service.getCategories().subscribe();
    httpMock.expectOne(service.baseApiUrl + '/LovType/findAllLovType').flush({data:[]});

    service.logout();

    service.getCategories().subscribe();
    httpMock.expectOne(service.baseApiUrl + '/LovType/findAllLovType').flush({data:[]});
  });
});
