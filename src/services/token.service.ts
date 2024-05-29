import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LoginDataContract } from '../contracts/login-data-contract';
import { RefreshTokensContract } from '../contracts/refreshTokens-req-contract';
import { HttpClient } from '@angular/common/http';
import { EndPoints, EndpointsType } from '../constants/endpoints';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private accessToken?: string;
  private refreshToken?: string;
  private expiryDate?: string;
  accessTokenKey: string = 'AccessToken';
  refreshTokenKey: string = 'RefreshToken';
  private readonly http = inject(HttpClient);
  endpoints: EndpointsType = EndPoints;

  setAccessToken(accessToken: string | undefined): void {
    this.accessToken = accessToken;
    localStorage.setItem('accessToken', accessToken ?? '');
  }

  getAccessToken(): string | undefined {
    return this.accessToken ?? localStorage.getItem('accessToken') ?? undefined;
  }
  setRefreshToken(refreshToken: string | undefined): void {
    this.refreshToken = refreshToken;
    localStorage.setItem('refreshToken', refreshToken ?? '');
  }

  getRefreshToken(): string | undefined {
    return (
      this.refreshToken ?? localStorage.getItem('refreshToken') ?? undefined
    );
  }

  setExpiryDate(expiryDate: string | undefined): void {
    this.expiryDate = expiryDate;
    localStorage.setItem('expiryDate', expiryDate ?? '');
  }

  hasAccessToken(): boolean {
    return (
      !!this.accessToken?.length ||
      !!localStorage.getItem('accessToken')?.length
    );
  }

  hasRefreshToken(): boolean {
    return (
      !!this.refreshToken?.length ||
      !!localStorage.getItem('refreshToken')?.length
    );
  }
  hasExpiryDate(): boolean {
    return (
      !!this.expiryDate?.length || !!localStorage.getItem('expiryDate')?.length
    );
  }
  getExpiryDate(): string | undefined {
    return this.expiryDate ?? localStorage.getItem('expiryDate') ?? undefined;
  }
  isAccessTokenExpired(): boolean | undefined {
    if (!this.hasExpiryDate()) return undefined;
    if (!this.hasRefreshToken()) return undefined;
    if (!this.hasRefreshToken()) return undefined;

    const expiryTimeMs = Date.parse(this.getExpiryDate() as string);
    let nowUtcMs = new Date().getUTCFullYear() - 1900; // Year
    nowUtcMs += (new Date().getUTCMonth() + 1) * 31; // Month (approx)
    nowUtcMs += new Date().getUTCDate(); // Day
    nowUtcMs *= 24 * 60 * 60 * 1000; // Add hours, minutes, seconds, milliseconds
    nowUtcMs += new Date().getUTCHours() * 60 * 60 * 1000;
    nowUtcMs += new Date().getUTCMinutes() * 60 * 1000;
    nowUtcMs += new Date().getUTCSeconds() * 1000;
    nowUtcMs += new Date().getUTCMilliseconds();

    return nowUtcMs >= expiryTimeMs;
  }

  refreshTokens(
    refreshToken: RefreshTokensContract
  ): Observable<LoginDataContract | boolean> {
    return this.isAccessTokenExpired()
      ? this.http.post<LoginDataContract>(
          this.endpoints.BASE_URL + this.endpoints.REFRESH_URL,
          refreshToken
        )
      : this.isAccessTokenExpired() == undefined
      ? of(false)
      : of(true);
  }
}
