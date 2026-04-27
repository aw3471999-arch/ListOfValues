import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoV } from '../../Services/ListOfView/lo-v';
import { catchError, map, of } from 'rxjs';

// export const authGuard: CanActivateFn = (route, state) => {
//   const router = inject(Router);
//   const lovService = inject(LoV);

//   const token = localStorage.getItem('token');

//   // No token at all → redirect immediately, no server call needed
//   if (!token) {
//     return router.createUrlTree(['/login']);
//   }

//   // Token exists → verify it with the server
//   return lovService.verifyUser().pipe(
//     map((response) => {
//       const isValid = !!response?.data?.[0];
//       if (isValid) {
//         return true;
//       }
//       // Server said token is invalid → clear it and redirect
//       localStorage.removeItem('token');
//       lovService.isLoggedIn.set(false);
//       return router.createUrlTree(['/login']);
//     }),
//     catchError(() => {
//       // Server error (network issue, 401, 500) → clear token and redirect
//       localStorage.removeItem('token');
//       lovService.isLoggedIn.set(false);
//       return of(router.createUrlTree(['/login']));
//     })
//   );
// };
