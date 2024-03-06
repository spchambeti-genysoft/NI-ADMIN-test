import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ApiService } from '../_providers/api-service/api.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const token: any =
    localStorage.getItem('thrott_token') ??
    sessionStorage.getItem('thrott_token');

  if (token) {
    return true;
  } else {
    console.log('Your session has been expired,please login again');
    router.navigateByUrl('login');
    return false;
  }
};
