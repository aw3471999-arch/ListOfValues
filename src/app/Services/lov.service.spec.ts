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
      ],
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

  describe('getCategories caching', () => {
    it('should only make one HTTP call on multiple subscriptions', () => {
      const mockResponse = { data: [[{ lovTypeId: 1, title: 'Test' }]] };

      service.getCategories().subscribe();
      service.getCategories().subscribe();

      const req = httpMock.expectOne(service.baseApiUrl + '/LovType/findAllLovType');
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('should make a new call after clearCache is called', () => {
      const mockResponse = { data: [[{ lovTypeId: 1, title: 'Test' }]] };

      service.getCategories().subscribe();
      let req = httpMock.expectOne(service.baseApiUrl + '/LovType/findAllLovType');
      req.flush(mockResponse);

      service.clearCache();

      service.getCategories().subscribe();
      req = httpMock.expectOne(service.baseApiUrl + '/LovType/findAllLovType');
      req.flush(mockResponse);
    });
  });

  describe('getListOfValues caching', () => {
    it('should cache results per lovTypeId', () => {
      const mockResponse1 = { data: [[{ lovId: 10, title: 'Value 1' }]] };
      const mockResponse2 = { data: [[{ lovId: 20, title: 'Value 2' }]] };

      service.getListOfValues(1).subscribe();
      service.getListOfValues(1).subscribe();
      service.getListOfValues(2).subscribe();

      httpMock.expectOne(req => req.body.data[0].lovTypeId === 1).flush(mockResponse1);
      httpMock.expectOne(req => req.body.data[0].lovTypeId === 2).flush(mockResponse2);
    });
  });

  describe('Cache invalidation', () => {
    it('should clear cache on addlov', () => {
      service.getCategories().subscribe();
      httpMock.expectOne(req => req.url.includes('findAllLovType')).flush({});

      service.addlov({ title: 'New' }).subscribe();
      httpMock.expectOne(req => req.url.includes('addlov')).flush({});

      service.getCategories().subscribe();
      httpMock.expectOne(req => req.url.includes('findAllLovType')).flush({});
    });

    it('should clear cache on deletelov', () => {
      service.getCategories().subscribe();
      httpMock.expectOne(req => req.url.includes('findAllLovType')).flush({});

      service.deletelov(123).subscribe();
      httpMock.expectOne(req => req.url.includes('deletelov')).flush({});

      service.getCategories().subscribe();
      httpMock.expectOne(req => req.url.includes('findAllLovType')).flush({});
    });

    it('should clear cache on logout', () => {
      service.getCategories().subscribe();
      httpMock.expectOne(req => req.url.includes('findAllLovType')).flush({});

      service.logout();

      service.getCategories().subscribe();
      httpMock.expectOne(req => req.url.includes('findAllLovType')).flush({});
    });
  });
});
