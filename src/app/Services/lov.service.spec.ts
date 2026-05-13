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
    const mockResponse = { data: [[{ lovTypeId: 1, title: 'Category 1' }]] };

    service.getCategories().subscribe();
    const req1 = httpMock.expectOne(req => req.url.includes('/LovType/findAllLovType'));
    req1.flush(mockResponse);

    // Second call should not trigger a new HTTP request
    service.getCategories().subscribe();
    httpMock.expectNone(req => req.url.includes('/LovType/findAllLovType'));
  });

  it('should cache LOVs per type after the first call', () => {
    const mockResponse = { data: [[{ lovId: 101, title: 'Value 1' }]] };
    const typeId = 1;

    service.getListOfValues(typeId).subscribe();
    const req1 = httpMock.expectOne(req => req.url.includes('/lov/findAlllov') && req.body.data[0].lovTypeId === typeId);
    req1.flush(mockResponse);

    // Second call for same type should be cached
    service.getListOfValues(typeId).subscribe();
    httpMock.expectNone(req => req.url.includes('/lov/findAlllov'));

    // Call for different type should trigger new request
    service.getListOfValues(2).subscribe();
    httpMock.expectOne(req => req.url.includes('/lov/findAlllov') && req.body.data[0].lovTypeId === 2);
  });

  it('should clear cache when clearCache is triggered via addlov/deletelov', () => {
    const mockResponse = { data: [[{ lovTypeId: 1, title: 'Category 1' }]] };

    service.getCategories().subscribe();
    httpMock.expectOne(req => req.url.includes('/LovType/findAllLovType')).flush(mockResponse);

    // Cache is now populated. Now add an LOV.
    service.addlov({ title: 'New' }).subscribe();
    httpMock.expectOne(req => req.url.includes('/lov/addlov')).flush({ success: true });

    // Next getCategories should trigger a new request because cache was cleared
    service.getCategories().subscribe();
    httpMock.expectOne(req => req.url.includes('/LovType/findAllLovType')).flush(mockResponse);
  });

  it('should clear cache on logout', () => {
    const mockResponse = { data: [[{ lovTypeId: 1, title: 'Category 1' }]] };

    service.getCategories().subscribe();
    httpMock.expectOne(req => req.url.includes('/LovType/findAllLovType')).flush(mockResponse);

    service.logout();

    // Next call should trigger new request
    service.getCategories().subscribe();
    httpMock.expectOne(req => req.url.includes('/LovType/findAllLovType')).flush(mockResponse);
  });
});
