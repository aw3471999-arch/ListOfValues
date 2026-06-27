import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { LovService } from './lov.service';

describe('LovService Caching', () => {
  let service: LovService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LovService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(LovService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should cache categories after the first call', () => {
    const mockData = { data: [[{ lovTypeId: 1, title: 'Category 1' }]] };

    service.getCategories().subscribe();
    const req1 = httpMock.expectOne(req => req.url.includes('/LovType/findAllLovType'));
    req1.flush(mockData);

    // Second call should not trigger a new request
    service.getCategories().subscribe(data => {
      expect(data).toEqual(mockData);
    });
    httpMock.expectNone(req => req.url.includes('/LovType/findAllLovType'));
  });

  it('should cache LOV items by lovTypeId', () => {
    const mockData = { data: [[{ lovId: 101, title: 'Item 1' }]] };
    const lovTypeId = 1;

    service.getListOfValues(lovTypeId).subscribe();
    const req1 = httpMock.expectOne(req => req.url.includes('/lov/findAlllov'));
    req1.flush(mockData);

    // Second call for same ID should be cached
    service.getListOfValues(lovTypeId).subscribe(data => {
      expect(data).toEqual(mockData);
    });
    httpMock.expectNone(req => req.url.includes('/lov/findAlllov'));

    // Different ID should trigger a new request
    service.getListOfValues(2).subscribe();
    httpMock.expectOne(req => req.url.includes('/lov/findAlllov'));
  });

  it('should clear cache when addlov is called', () => {
    service.getCategories().subscribe();
    httpMock.expectOne(req => req.url.includes('/LovType/findAllLovType')).flush({});

    // Cache is now populated. Calling addlov should clear it.
    service.addlov({ title: 'New Item' }).subscribe();
    httpMock.expectOne(req => req.url.includes('/lov/addlov')).flush({});

    // Next getCategories should trigger new request
    service.getCategories().subscribe();
    httpMock.expectOne(req => req.url.includes('/LovType/findAllLovType'));
  });

  it('should clear cache when deletelov is called', () => {
    service.getListOfValues(1).subscribe();
    httpMock.expectOne(req => req.url.includes('/lov/findAlllov')).flush({});

    service.deletelov(101).subscribe();
    httpMock.expectOne(req => req.url.includes('/lov/deletelov')).flush({});

    service.getListOfValues(1).subscribe();
    httpMock.expectOne(req => req.url.includes('/lov/findAlllov'));
  });

  it('should clear cache on error to allow retry', () => {
    service.getCategories().subscribe({ error: () => {} });
    const req = httpMock.expectOne(req => req.url.includes('/LovType/findAllLovType'));
    req.error(new ProgressEvent('error'));

    // Next call should retry because cache was cleared on error
    service.getCategories().subscribe();
    httpMock.expectOne(req => req.url.includes('/LovType/findAllLovType'));
  });
});
