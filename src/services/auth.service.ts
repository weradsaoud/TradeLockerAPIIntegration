import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CredentialsContract } from '../contracts/credentials-contract';
import { LoginDataContract } from '../contracts/login-data-contract';
import { EndPoints, EndpointsType } from '../constants/endpoints';
import { HttpClient } from '@angular/common/http';
import { TokenService } from './token.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  endpoints: EndpointsType = EndPoints;
  authenticated: boolean = false;
  private readonly http = inject(HttpClient);
  private readonly tokenService = inject(TokenService);
  router = inject(Router);
  constructor() {}

  login(credentials: CredentialsContract): Observable<LoginDataContract> {
    return this.http.post<LoginDataContract>(
      this.endpoints.BASE_URL + this.endpoints.LOGIN_URL,
      credentials
    );
  }

  logout() {
    this.tokenService.setAccessToken(undefined);
    this.tokenService.setRefreshToken(undefined);
    this.tokenService.setExpiryDate(undefined);
    this.router.navigateByUrl('/');
  }
}
