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

  it('should cache categories after the first call', () => {
    const mockResponse = { data: [[{ title: 'Cat 1' }]] };

    service.getCategories().subscribe();
    const req = httpMock.expectOne(service.baseApiUrl + '/LovType/findAllLovType');
    req.flush(mockResponse);

    // Second call should not trigger another HTTP request
    service.getCategories().subscribe();
    httpMock.expectNone(service.baseApiUrl + '/LovType/findAllLovType');
  });

  it('should cache LOV items by ID', () => {
    const lovTypeId = 1;
    const mockResponse = { data: [[{ title: 'Item 1' }]] };

    service.getListOfValues(lovTypeId).subscribe();
    const req = httpMock.expectOne(`${service.baseApiUrl}/lov/findAlllov`);
    req.flush(mockResponse);

    // Second call for same ID should be cached
    service.getListOfValues(lovTypeId).subscribe();
    httpMock.expectNone(`${service.baseApiUrl}/lov/findAlllov`);

    // Call for different ID should trigger new request
    service.getListOfValues(2).subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/lov/findAlllov`);
  });

  it('should clear cache on addlov', () => {
    service.getCategories().subscribe();
    httpMock.expectOne(service.baseApiUrl + '/LovType/findAllLovType').flush({});

    service.addlov({}).subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/lov/addlov`).flush({});

    // Should trigger new request after addlov
    service.getCategories().subscribe();
    httpMock.expectOne(service.baseApiUrl + '/LovType/findAllLovType');
  });

  it('should reset cache if an error occurs', () => {
    service.getCategories().subscribe({ error: () => {} });
    const req = httpMock.expectOne(service.baseApiUrl + '/LovType/findAllLovType');
    req.error(new ProgressEvent('error'));

    // Should trigger new request because previous failed
    service.getCategories().subscribe();
    httpMock.expectOne(service.baseApiUrl + '/LovType/findAllLovType');
  });
});
