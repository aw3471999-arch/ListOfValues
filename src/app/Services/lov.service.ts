import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap, shareReplay, Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LovService {
  private http = inject(HttpClient);
  private router = inject(Router);
  baseApiUrl = 'https://deveduportalbe.hive-worx.com:3038/edunode';

  isLoggedIn = signal<boolean>(!!localStorage.getItem('token'));

  // Performance Optimization: Cache for categories and LOV items
  private categoriesCache$?: Observable<any>;
  private lovCache = new Map<number, Observable<any>>();

  /**
   * Clears all cached API responses.
   * Called after mutations (add/delete) or auth changes.
   */
  private clearCache() {
    this.categoriesCache$ = undefined;
    this.lovCache.clear();
  }

  /**
   * Fetches all LOV categories. Results are cached using shareReplay.
   */
  getCategories() {
    if (!this.categoriesCache$) {
      const body = { data: [{}] };
      this.categoriesCache$ = this.http.post<any>(this.baseApiUrl + '/LovType/findAllLovType', body).pipe(
        shareReplay(1),
        catchError((err) => {
          this.categoriesCache$ = undefined;
          return throwError(() => err);
        })
      );
    }
    return this.categoriesCache$;
  }

  /**
   * Fetches LOV items for a specific category. Results are cached per lovTypeId.
   */
  getListOfValues(lovTypeId: number) {
    if (!this.lovCache.has(lovTypeId)) {
      const body = { data: [{ lovTypeId: lovTypeId }] };
      const call$ = this.http.post<any>(`${this.baseApiUrl}/lov/findAlllov`, body).pipe(
        shareReplay(1),
        catchError((err) => {
          this.lovCache.delete(lovTypeId);
          return throwError(() => err);
        })
      );
      this.lovCache.set(lovTypeId, call$);
    }
    return this.lovCache.get(lovTypeId)!;
  }

  addlov(formattedData: any) {
    const body = { data: [formattedData] };
    return this.http.post<any>(`${this.baseApiUrl}/lov/addlov`, body).pipe(
      tap(() => this.clearCache())
    );
  }

  deletelov(lovId: number) {
    const body = { data: [{ lovId: lovId }] };
    return this.http.post<any>(`${this.baseApiUrl}/lov/deletelov`, body).pipe(
      tap(() => this.clearCache())
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
          this.clearCache();
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
