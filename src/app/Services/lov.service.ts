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

  // Caches for API responses to improve performance and reduce network load
  private categoriesCache$?: Observable<any>;
  private lovCache = new Map<number, Observable<any>>();

  /**
   * Clears all cached API responses.
   * Should be called when data is modified or user logs out.
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
    this.categoriesCache$ = this.http.post<any>(this.baseApiUrl + '/LovType/findAllLovType', body).pipe(
      shareReplay(1),
      catchError((err) => {
        // Reset cache on error so next attempt tries again
        this.categoriesCache$ = undefined;
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
        // Remove from cache on error
        this.lovCache.delete(lovTypeId);
        return throwError(() => err);
      })
    );
    this.lovCache.set(lovTypeId, request$);
    return request$;
  }

  addlov(formattedData: any) {
    const body = { data: [formattedData] };
    return this.http.post<any>(`${this.baseApiUrl}/lov/addlov`, body).pipe(
      tap(() => this.clearCache()) // Invalidate cache on addition
    );
  }

  deletelov(lovId: number) {
    const body = { data: [{ lovId: lovId }] };
    return this.http.post<any>(`${this.baseApiUrl}/lov/deletelov`, body).pipe(
      tap(() => this.clearCache()) // Invalidate cache on deletion
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
          this.clearCache(); // Clear any stale cache from previous sessions
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
