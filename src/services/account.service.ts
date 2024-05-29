import { Injectable, inject } from '@angular/core';
import { AccountContract } from '../contracts/account-cotract';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EndPoints, EndpointsType } from '../constants/endpoints';
import { TokenService } from './token.service';
import { AccountDetailsContract } from '../contracts/accountDeails_contract';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private readonly http = inject(HttpClient);
  private readonly tokenService = inject(TokenService);

  constructor() {}
  endpoints: EndpointsType = EndPoints;
  accounts$ = new BehaviorSubject<AccountContract[]>([]);
  currentAccount: AccountContract | null = null;
  selectAccount$ = new BehaviorSubject<AccountContract | null>(null);
  accountDetails$ = new BehaviorSubject<AccountDetailsContract | null>(null);

  getAccounts(): Observable<AccountContract[]> {
    return this.http
      .get<{ accounts: AccountContract[] }>(
        this.endpoints.BASE_URL + this.endpoints.ACCOUNTS_URL
      )
      .pipe(
        map((accounts) => accounts.accounts),
        tap((accounts) => {
          this.accounts$.next(accounts);
          if (!!accounts.length) {
            this.selectAccount$.next(
              !!this.currentAccount
                ? accounts.find((acc) => acc.id === this.currentAccount?.id) ??
                    accounts[0]
                : accounts[0]
            );
            this.currentAccount = !!this.currentAccount
              ? accounts.find((acc) => acc.id === this.currentAccount?.id) ??
                accounts[0]
              : accounts[0];
          }
        })
      );
  }

  getAccountDetails(accNum: string): Observable<AccountDetailsContract> {
    return this.http
      .get<{ s: string; d: AccountDetailsContract[] }>(
        this.endpoints.BASE_URL + this.endpoints.ACCOUNTDETAILS_URL,
        {
          headers: {
            ['accNum']: accNum,
          },
        }
      )
      .pipe(
        map((res) => {
          return res.d[0];
        }),
        tap((accountDetails) => this.accountDetails$.next(accountDetails))
      );
  }
}
