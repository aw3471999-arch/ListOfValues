import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, shareReplay, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LovService {
  private http = inject(HttpClient);
  private router = inject(Router);
  baseApiUrl = 'https://deveduportalbe.hive-worx.com:3038/edunode';

  isLoggedIn = signal<boolean>(!!localStorage.getItem('token'));

  /**
   * Caches for API responses to improve performance by reducing redundant network requests.
   * shareReplay(1) ensures late subscribers get the last emitted value.
   */
  private categoriesCache$: Observable<any> | null = null;
  private lovCache = new Map<number, Observable<any>>();

  // verifyUser() {
  //   const token = localStorage.getItem('token');
  //   if (!token) return of(null);
  //   return this.http.post<any>(`${this.baseApiUrl}/verifyUser`, { data: [{ token }] });
  // }

  getCategories() {
    if (this.categoriesCache$) {
      return this.categoriesCache$;
    }

    const body = { data: [{}] };
    this.categoriesCache$ = this.http.post<any>(this.baseApiUrl + '/LovType/findAllLovType', body).pipe(
      shareReplay(1),
      catchError((error) => {
        this.categoriesCache$ = null;
        return throwError(() => error);
      })
    );
    return this.categoriesCache$;
  }

  getListOfValues(lovTypeId: number) {
    const cached = this.lovCache.get(lovTypeId);
    if (cached) {
      return cached;
    }

    const body = { data: [{ lovTypeId: lovTypeId }] };
    const request = this.http.post<any>(`${this.baseApiUrl}/lov/findAlllov`, body).pipe(
      shareReplay(1),
      catchError((error) => {
        this.lovCache.delete(lovTypeId);
        return throwError(() => error);
      })
    );
    this.lovCache.set(lovTypeId, request);
    return request;
  }

  private clearCache() {
    this.categoriesCache$ = null;
    this.lovCache.clear();
  }

  addlov(formattedData: any) {
    this.clearCache();
    const body = { data: [formattedData] };
    return this.http.post<any>(`${this.baseApiUrl}/lov/addlov`, body);
  }

  deletelov(lovId: number) {
    this.clearCache();
    const body = { data: [{ lovId: lovId }] };
    return this.http.post<any>(`${this.baseApiUrl}/lov/deletelov`, body);
  }

  searchLov(searchCriteria: any) {
    const body = { data: [searchCriteria] };
    return this.http.post<any>(`${this.baseApiUrl}/lov/findAlllov`, body);
  }

  login(credentials: any) {
    const body = { data: [credentials] };
    return this.http.post<any>(`${this.baseApiUrl}/login`, body).pipe(
      tap((response) => {
        const verification = response?.data?.[0]?.verification;
        const token = verification?.token;

        if (token) {
          localStorage.setItem('token', token);
          this.isLoggedIn.set(true);
        }
      })
    );
  }

  logout() {
    this.clearCache();
    localStorage.removeItem('token');
    this.isLoggedIn.set(false);
  }
}
