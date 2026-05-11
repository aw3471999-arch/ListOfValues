import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LovService } from '../../Services/lov.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const lovService = inject(LovService);

  const token = localStorage.getItem('token');

  if (!token) {
    return router.createUrlTree(['/login']);
  }

  // Simplified guard: if token exists, we consider them logged in for now.
  // Full verification can be added if the verifyUser endpoint is stable.
  if (token) {
    lovService.isLoggedIn.set(true);
    return true;
  }

  return router.createUrlTree(['/login']);
};
