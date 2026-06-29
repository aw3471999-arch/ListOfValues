import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
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

  it('should cache getCategories results', () => {
    // First call
    service.getCategories().subscribe();
    const req1 = httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`);
    req1.flush({ data: [['cat1']] });

    // Second call should NOT trigger a new request
    service.getCategories().subscribe();
    httpMock.expectNone(`${service.baseApiUrl}/LovType/findAllLovType`);
  });

  it('should clear cache on addlov', () => {
    // Fill cache
    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`).flush({ data: [['cat1']] });

    // Mutation
    service.addlov({ title: 'new' }).subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/lov/addlov`).flush({ data: [] });

    // Next call should trigger a new request
    service.getCategories().subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/LovType/findAllLovType`).flush({ data: [['cat1']] });
  });

  it('should cache getListOfValues by lovTypeId', () => {
    // Call for type 1
    service.getListOfValues(1).subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/lov/findAlllov`).flush({ data: [['item1']] });

    // Second call for type 1 (cached)
    service.getListOfValues(1).subscribe();
    httpMock.expectNone(`${service.baseApiUrl}/lov/findAlllov`);

    // Call for type 2 (not cached)
    service.getListOfValues(2).subscribe();
    httpMock.expectOne(`${service.baseApiUrl}/lov/findAlllov`).flush({ data: [['item2']] });
  });
});
