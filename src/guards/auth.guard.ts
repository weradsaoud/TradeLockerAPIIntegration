import { CanMatchFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AppFullRoutes } from '../constants/app-full-routes';
import { TokenService } from '../services/token.service';

export const authGuard: (
  whenFailRedirectTo?: string,
) => CanMatchFn = (whenFailRedirectTo) => () => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  const tree = router.parseUrl(whenFailRedirectTo??'/');
  return (() => {
        return tokenService.hasAccessToken() ? true : tree;
      })();
};

export const loginGuard: (
  whenFailRedirectTo?: string,
) => CanMatchFn = (whenFailRedirectTo) => () => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  const tree = router.parseUrl(whenFailRedirectTo??'home');
  return (() => {
        return !tokenService.hasAccessToken() ? true : tree;
      })();
};
