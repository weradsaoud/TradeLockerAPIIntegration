import { Component, OnInit, inject } from '@angular/core';
import { Order } from '../../model/order';
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { InputComponent } from '../input/input.component';
import {
  routIdList,
  sideList,
  stopLossTypeList,
  takeProfitTypeList,
  typeList,
  validityList,
} from '../../constants/order-lists';
import { SelectInputComponent } from '../select-input/select-input.component';
import { LoadingService } from '../../services/loading.service';
import { CommonModule } from '@angular/common';
import {
  Observable,
  Subject,
  catchError,
  exhaustMap,
  filter,
  isObservable,
  of,
  switchMap,
  takeUntil,
  throwError,
} from 'rxjs';
import { ButtonComponent } from '../button/button.component';
import { InstrumentsService } from '../../services/instruments.service';
import { OrderService } from '../../services/order.service';
import { AccountService } from '../../services/account.service';
import { ignoreErrors } from '../../utils/utils';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-trade-form',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatDividerModule,
    InputComponent,
    ReactiveFormsModule,
    SelectInputComponent,
    ButtonComponent,
  ],
  templateUrl: './trade-form.component.html',
  styleUrl: './trade-form.component.scss',
})
export class TradeFormComponent implements OnInit {
  loadingService = inject(LoadingService);
  instrumentsService = inject(InstrumentsService);
  orderService = inject(OrderService);
  accountService = inject(AccountService);
  toastService = inject(ToastService);
  order = new Order();
  form!: UntypedFormGroup;
  fb = inject(UntypedFormBuilder);
  save$: Subject<void> = new Subject<void>();
  routIdList = routIdList;
  sideList = sideList;
  stopLossTypeList = stopLossTypeList;
  takeProfitTypeList = takeProfitTypeList;
  typeList = typeList;
  validityList = validityList;
  ngOnInit(): void {
    this.form = this.fb.group(this.order.buildForm(true));
    this._listenToSave();
  }
  protected _listenToSave() {
    this.save$
      .pipe(
        switchMap(() => {
          const result = this._beforeSave();
          return isObservable(result) ? result : of(result);
        })
      )
      .pipe(filter((value) => value))
      .pipe(
        switchMap(() => {
          const result = this._prepareModel();
          return isObservable(result) ? result : of(result);
        })
      )
      .pipe(
        exhaustMap((model) => {
          return this.orderService
            .save(
              model,
              this.accountService.currentAccount?.id?.toString() as string,
              this.accountService.currentAccount?.accNum as string
            )
            .pipe(
              catchError((error) => {
                this._saveFail(error);
                return throwError(error);
              }),
              ignoreErrors()
            );
        })
      )
      .subscribe((model) => {
        this._afterSave(model);
      });
  }

  protected _beforeSave(): boolean | Observable<boolean> {
    this.loadingService.show();
    this.form.markAllAsTouched();
    console.log(this.form.errors);
    if (
      this.instrumentsService.currentInstrument === null ||
      this.instrumentsService.currentInstrument === undefined
    ) {
      this.toastService.error('Please, Select an instrument.');
      this.loadingService.hide();
      return false;
    }
    return true; //this.form.valid;
  }

  protected _prepareModel(): Order | Observable<Order> {
    let orderModel: Order = {
      ...this.order,
      ...this.form.value,
    };
    return {
      ...orderModel,
      tradableInstrumentId: this.instrumentsService.currentInstrument
        ?.tradableInstrumentId as number,
    } as Order;
  }

  protected _saveFail(error: any) {
    this.loadingService.hide();
    this.toastService.error('Failed to place order.');
    console.log('save fail: ', error);
  }

  _afterSave(model: boolean) {
    this.accountService.getAccounts().subscribe((res) => {
      
    });
    this.loadingService.hide();
    if (model) {
      this.toastService.success('Order was placed successfully.');
    } else {
      this.toastService.error('Failed to place order.');
    }
  }
}
