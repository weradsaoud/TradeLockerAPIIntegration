import { Component, Input, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { AccountDetailsContract } from '../../contracts/accountDeails_contract';
import { AccountDetailsModel } from '../../model/AccountDetailsModel';
import { AppTableDataSource } from '../../model/app-table-data-source';
import { Observable, delay, distinctUntilChanged, map } from 'rxjs';
import { AccountService } from '../../services/account.service';
import { MatDividerModule } from '@angular/material/divider';
import { InstrumentContract } from '../../contracts/instrument-contract';

@Component({
  selector: 'app-account-details',
  standalone: true,
  imports: [MatCardModule, MatTableModule, MatDividerModule],
  templateUrl: './account-details.component.html',
  styleUrl: './account-details.component.scss',
})
export class AccountDetailsComponent {
  private readonly accountService = inject(AccountService);
  displayedColumns: string[] = ['property', 'value'];
  data$: Observable<{ property: string; value: string }[]> =
    this.arrangeAccountProperties();
  dataSource: AppTableDataSource<{ property: string; value: string }> =
    new AppTableDataSource<{ property: string; value: string }>(this.data$);
  
  arrangeAccountProperties(): Observable<
    { property: string; value: string }[]
  > {
    return this.accountService.accountDetails$
      .asObservable()
      .pipe(delay(0), distinctUntilChanged())
      .pipe(
        map((accDetails) => {
          if (!accDetails) return [];
          let accountDetailsModel: AccountDetailsModel =
            new AccountDetailsModel(accDetails as AccountDetailsContract);
          let arr: { property: string; value: string }[] = [];
          Object.keys(accountDetailsModel).forEach((key) => {
            arr.push({
              property: `${key[0].toUpperCase()}${key.slice(1)}`.replace(
                /_/g,
                ' '
              ),
              value: (accountDetailsModel as any)[key],
            });
          });
          console.log('arr: ', arr);

          return arr;
        })
      );
  }
}
