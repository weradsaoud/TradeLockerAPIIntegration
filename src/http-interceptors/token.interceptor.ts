import { inject, Injectable } from '@angular/core';
import {
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { TokenService } from '../services/token.service';

export function authInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn) {

  const tokenService = inject(TokenService);
  const token = tokenService.getAccessToken();
    if (tokenService.hasAccessToken()) {
      request = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`),
      });
    }
    return next(request);
}
