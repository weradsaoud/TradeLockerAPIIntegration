import { Component, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { SelectComponent } from '../select/select.component';
import { AccountService } from '../../services/account.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    NgOptimizedImage,
    SelectComponent,
    CommonModule,
  ],
  templateUrl: './app-nav.component.html',
  styleUrl: './app-nav.component.scss',
})
export class AppNavComponent implements OnInit {
  accountService = inject(AccountService);
  authService = inject(AuthService);
  options: { viewValue: string; value: string }[] = [];
  balance!: string;
  userName!: string;

  ngOnInit(): void {
    this.userName = localStorage.getItem('user') ?? '';
    this.accountService.accounts$.subscribe((accounts) => {
      console.log('2: ', accounts);
      accounts.forEach((account) => {
        this.options.push({
          viewValue: account.name,
          value: account.accNum.toString(),
        });
      });
      this.options = this.options.filter((o) => true);
    });
    this.accountService.selectAccount$.subscribe((acc) => {
      this.balance = acc?.accountBalance + ' ' + acc?.currency;
    });
  }
}
