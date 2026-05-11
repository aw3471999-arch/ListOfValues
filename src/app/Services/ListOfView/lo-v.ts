import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoV {
  private http = inject(HttpClient);
  private router = inject(Router);
  baseApiUrl = 'https://deveduportalbe.hive-worx.com:3038/edunode';

  isLoggedIn = signal<boolean>(!!localStorage.getItem('token'));

  // verifyUser() {
  //   const token = localStorage.getItem('token');
  //   if (!token) return of(null);
  //   return this.http.post<any>(`${this.baseApiUrl}/verifyUser`, { data: [{ token }] });
  // }

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
        const verification = response?.data?.[0]?.verification;
        const token = verification?.token;

        if (token) {
          localStorage.setItem('token', token);
          
          // if (verification?.case === 'ALREADY_LOGGED_IN') {
          //   this.verifyUser().subscribe({
          //     next: (res) => {
          //       this.isLoggedIn.set(true);
          //       this.router.navigate(['/dashboard']);
          //     },
          //   });
          // } else {
            this.isLoggedIn.set(true);
          // }
        }
      })
    );
  }

  updateUserStatus(status: number, userId: number) {
  const body = { 
    data: [{ 
      userId: userId, 
      status: status 
    }] 
  };
  return this.http.post<any>(`${this.baseApiUrl}/updateUserStatus`, body);
}

logout() {

  const userData = JSON.parse(localStorage.getItem('user_session') || '{}');
  const userId = userData.userId || 2; 

  this.updateUserStatus(0, userId).subscribe({
    next: () => {
      this.finalizeLogout();
    },
    error: (err) => {
      console.error('Logout sync failed:', err);
      this.finalizeLogout();
    }
  });
}

private finalizeLogout() {
  localStorage.clear();
  this.isLoggedIn.set(false);
  window.location.href = '/login';
}

  // logout(){
  //   localStorage.removeItem('token');
  //   this.isLoggedIn.set(false);
  //   window.location.href='/login';
  // }

}