import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoV {
  private http = inject(HttpClient);
  baseApiUrl = 'https://deveduportalbe.hive-worx.com:3038/edunode';

  isLoggedIn = signal<boolean>(!!localStorage.getItem('token'));

  getCategories() {
    const body = { data: [{}] };
    return this.http.post<any>(this.baseApiUrl + '/LovType/findAllLovType', body);
  }

  getListOfValues(lovTypeId: number) {
    const body = { data: [{ lovTypeId: lovTypeId }] };
    return this.http.post<any>(`${this.baseApiUrl}/lov/findAlllov`, body);
  }

  addlov(formattedData: any) {
    const body = { data: [formattedData] };
    return this.http.post<any>(`${this.baseApiUrl}/lov/addlov`, body);
  }

  deletelov(lovId: number) {
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
      const token = response?.data?.[0]?.verification?.token;
      if (token) {
        // Force immediate write
        localStorage.setItem('token', token);
        this.isLoggedIn.set(true);
        console.log('Token saved successfully');
      }
    })
  );
}

  logout() {
  localStorage.clear();
  this.isLoggedIn.set(false);
}
}