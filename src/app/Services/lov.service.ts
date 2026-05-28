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

  // Cache for categories (semi-static data) to avoid redundant network requests.
  private categoriesCache$: Observable<any> | null = null;
  // Map-based cache for LOVs by type ID to ensure each category is fetched only once.
  private lovCache = new Map<number, Observable<any>>();

  /**
   * Resets all cached observables. Called upon logout or when data modifications
   * (add/delete) occur to ensure the UI remains consistent with the server.
   */
  private clearCache() {
    this.categoriesCache$ = null;
    this.lovCache.clear();
  }

  // verifyUser() {
  //   const token = localStorage.getItem('token');
  //   if (!token) return of(null);
  //   return this.http.post<any>(`${this.baseApiUrl}/verifyUser`, { data: [{ token }] });
  // }

  /**
   * Fetches all LOV categories. Uses shareReplay(1) to cache the response
   * and reduce server load for this frequently accessed semi-static data.
   */
  getCategories() {
    if (!this.categoriesCache$) {
      const body = { data: [{}] };
      this.categoriesCache$ = this.http
        .post<any>(this.baseApiUrl + '/LovType/findAllLovType', body)
        .pipe(
          shareReplay(1),
          catchError((err) => {
            this.clearCache();
            return throwError(() => err);
          })
        );
    }
    return this.categoriesCache$;
  }

  /**
   * Fetches LOVs for a specific category ID. Caches the resulting observable
   * to prevent multiple HTTP calls when switching between categories in the UI.
   */
  getListOfValues(lovTypeId: number) {
    if (!this.lovCache.has(lovTypeId)) {
      const body = { data: [{ lovTypeId: lovTypeId }] };
      const request$ = this.http.post<any>(`${this.baseApiUrl}/lov/findAlllov`, body).pipe(
        shareReplay(1),
        catchError((err) => {
          this.clearCache();
          return throwError(() => err);
        })
      );
      this.lovCache.set(lovTypeId, request$);
    }
    return this.lovCache.get(lovTypeId)!;
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
