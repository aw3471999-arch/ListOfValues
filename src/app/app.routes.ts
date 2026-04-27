import { Routes } from '@angular/router';
import { Dashboard } from './Components/Dashboard/dashboard/dashboard/dashboard';
import { Login } from './Components/login/login';
// import { authGuard} from './Components/Gaurd/authguard.guard';

export const routes: Routes = [
  { path: 'login', component: Login },

  {
    path: 'dashboard',
    component: Dashboard,
    // canActivate:[authGuard]
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
