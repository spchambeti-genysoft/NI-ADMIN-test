import { Routes } from '@angular/router';
import { LoginComponent } from './Authentication/login/login.component';
import { authGuard } from './Core/_guards/auth.guard';
import { HeaderComponent } from './Layout/header/header.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'login', redirectTo: '/login', pathMatch: 'full' },
  {
    path: '',
    redirectTo: 'admin/dashboard',
    pathMatch: 'full',
    // canActivate: [authGuard],
  },
  {
    path: '',
    component: HeaderComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'admin',
        loadChildren: () =>
          import('./Features/routes').then((module) => module.ADMIN_ROUTES),
      },
    ],
  },
];
