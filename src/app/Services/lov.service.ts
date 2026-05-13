import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, shareReplay, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LovService {
  private http = inject(HttpClient);
  private router = inject(Router);
  baseApiUrl = 'https://deveduportalbe.hive-worx.com:3038/edunode';

  isLoggedIn = signal<boolean>(!!localStorage.getItem('token'));

  private categoriesCache$?: Observable<any>;
  private lovCache = new Map<number, Observable<any>>();

  // verifyUser() {
  //   const token = localStorage.getItem('token');
  //   if (!token) return of(null);
  //   return this.http.post<any>(`${this.baseApiUrl}/verifyUser`, { data: [{ token }] });
  // }

  getCategories() {
    if (!this.categoriesCache$) {
      const body = { data: [{}] };
      this.categoriesCache$ = this.http
        .post<any>(this.baseApiUrl + '/LovType/findAllLovType', body)
        .pipe(shareReplay(1));
    }
    return this.categoriesCache$;
  }

  getListOfValues(lovTypeId: number) {
    let cached = this.lovCache.get(lovTypeId);
    if (!cached) {
      const body = { data: [{ lovTypeId: lovTypeId }] };
      cached = this.http
        .post<any>(`${this.baseApiUrl}/lov/findAlllov`, body)
        .pipe(shareReplay(1));
      this.lovCache.set(lovTypeId, cached);
    }
    return cached;
  }

  private clearCache() {
    this.categoriesCache$ = undefined;
    this.lovCache.clear();
  }

  addlov(formattedData: any) {
    const body = { data: [formattedData] };
    return this.http
      .post<any>(`${this.baseApiUrl}/lov/addlov`, body)
      .pipe(tap(() => this.clearCache()));
  }

  deletelov(lovId: number) {
    const body = { data: [{ lovId: lovId }] };
    return this.http
      .post<any>(`${this.baseApiUrl}/lov/deletelov`, body)
      .pipe(tap(() => this.clearCache()));
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
