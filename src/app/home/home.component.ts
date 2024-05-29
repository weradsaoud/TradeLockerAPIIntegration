import { Component, OnInit, inject } from '@angular/core';
import { AppNavComponent } from '../../custom-components/app-nav/app-nav.component';
import { AccountService } from '../../services/account.service';
import { TokenService } from '../../services/token.service';
import { concatMap, filter, tap } from 'rxjs';
import { LoadingService } from '../../services/loading.service';
import { AccountDetailsComponent } from '../../custom-components/account-details/account-details.component';
import { InstrumentsService } from '../../services/instruments.service';
import { InstrumentsComponent } from '../../custom-components/instruments/instruments.component';
import { TradeFormComponent } from '../../custom-components/trade-form/trade-form.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    AppNavComponent,
    AccountDetailsComponent,
    InstrumentsComponent,
    TradeFormComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private readonly accountService = inject(AccountService);
  private readonly instrumentsService = inject(InstrumentsService);
  private readonly tokenService = inject(TokenService);
  private readonly loadingService = inject(LoadingService);

  ngOnInit(): void {
    this.tokenService
      .refreshTokens({
        refreshToken: this.tokenService.getRefreshToken() as string,
      })
      .pipe(tap(() => this.loadingService.show()))
      .pipe(
        // Filter out false values (meaning either refresh was successful or not needed)
        filter((shouldRefresh) => !!shouldRefresh),
        // Concatenate the getAccounts observable only if refresh was not needed
        concatMap(() => this.accountService.getAccounts()),
        filter((accounts) => !!accounts?.length),
        concatMap((accounts) =>
          this.accountService.getAccountDetails(accounts[0].accNum)
        ),
        filter((accDetails) => !!accDetails),
        concatMap(() =>
          this.instrumentsService.getInstruments(
            this.accountService.currentAccount?.accNum as string,
            this.accountService.currentAccount?.id as number
          )
        )
      )
      .subscribe((accounts) => {
        this.loadingService.hide();
      });
  }
}
