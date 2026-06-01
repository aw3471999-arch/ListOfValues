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

  // Caches for categories and LOVs to improve performance
  private categoriesCache$?: Observable<any>;
  private lovCache = new Map<number, Observable<any>>();

  // verifyUser() {
  //   const token = localStorage.getItem('token');
  //   if (!token) return of(null);
  //   return this.http.post<any>(`${this.baseApiUrl}/verifyUser`, { data: [{ token }] });
  // }

  /**
   * Fetches all LOV categories with caching.
   * Caching reduces redundant network requests when switching between views.
   */
  getCategories() {
    if (!this.categoriesCache$) {
      const body = { data: [{}] };
      this.categoriesCache$ = this.http
        .post<any>(this.baseApiUrl + '/LovType/findAllLovType', body)
        .pipe(
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
   * Fetches LOV items for a specific category with caching.
   * Improves speed when the user navigates back to a previously loaded category.
   */
  getListOfValues(lovTypeId: number) {
    let cache$ = this.lovCache.get(lovTypeId);
    if (!cache$) {
      const body = { data: [{ lovTypeId: lovTypeId }] };
      cache$ = this.http.post<any>(`${this.baseApiUrl}/lov/findAlllov`, body).pipe(
        shareReplay(1),
        catchError((err) => {
          this.lovCache.delete(lovTypeId);
          return throwError(() => err);
        })
      );
      this.lovCache.set(lovTypeId, cache$);
    }
    return cache$;
  }

  /**
   * Invalidates all caches to ensure data consistency.
   */
  private clearCache() {
    this.categoriesCache$ = undefined;
    this.lovCache.clear();
  }

  addlov(formattedData: any) {
    const body = { data: [formattedData] };
    return this.http.post<any>(`${this.baseApiUrl}/lov/addlov`, body).pipe(
      tap(() => this.clearCache()) // Clear cache on data change
    );
  }

  deletelov(lovId: number) {
    const body = { data: [{ lovId: lovId }] };
    return this.http.post<any>(`${this.baseApiUrl}/lov/deletelov`, body).pipe(
      tap(() => this.clearCache()) // Clear cache on data change
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
    this.clearCache(); // Clear cache on logout
  }
}
