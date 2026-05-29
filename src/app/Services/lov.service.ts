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

  // Cache for categories and LOVs to reduce redundant API calls
  private categoriesCache$?: Observable<any>;
  private lovCache = new Map<number, Observable<any>>();

  /**
   * Clears all cached data. Should be called after modifications or logout.
   */
  clearCache() {
    this.categoriesCache$ = undefined;
    this.lovCache.clear();
  }

  getCategories() {
    if (this.categoriesCache$) {
      return this.categoriesCache$;
    }

    const body = { data: [{}] };
    this.categoriesCache$ = this.http
      .post<any>(this.baseApiUrl + '/LovType/findAllLovType', body)
      .pipe(
        shareReplay(1),
        catchError((err) => {
          this.categoriesCache$ = undefined; // Don't cache errors
          return throwError(() => err);
        })
      );

    return this.categoriesCache$;
  }

  getListOfValues(lovTypeId: number) {
    if (this.lovCache.has(lovTypeId)) {
      return this.lovCache.get(lovTypeId)!;
    }

    const body = { data: [{ lovTypeId: lovTypeId }] };
    const request$ = this.http.post<any>(`${this.baseApiUrl}/lov/findAlllov`, body).pipe(
      shareReplay(1),
      catchError((err) => {
        this.lovCache.delete(lovTypeId); // Don't cache errors
        return throwError(() => err);
      })
    );

    this.lovCache.set(lovTypeId, request$);
    return request$;
  }

  addlov(formattedData: any) {
    const body = { data: [formattedData] };
    return this.http.post<any>(`${this.baseApiUrl}/lov/addlov`, body).pipe(
      tap(() => this.clearCache()) // Invalidate cache on add
    );
  }

  deletelov(lovId: number) {
    const body = { data: [{ lovId: lovId }] };
    return this.http.post<any>(`${this.baseApiUrl}/lov/deletelov`, body).pipe(
      tap(() => this.clearCache()) // Invalidate cache on delete
    );
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
    localStorage.removeItem('token');
    this.isLoggedIn.set(false);
    this.clearCache();
  }
}
