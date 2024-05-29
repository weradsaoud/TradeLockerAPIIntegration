import { Injectable, inject } from '@angular/core';
import { Order } from '../model/order';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EndPoints, EndpointsType } from '../constants/endpoints';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  http = inject(HttpClient);
  endpoints: EndpointsType = EndPoints;

  constructor() {}
  
  save(order: Order, accountId: string, accNum: string): Observable<boolean> {
    return this.http
      .post<{ d: any; s: string }>(
        this.endpoints.BASE_URL + this.endpoints.ORDER_URL(accountId),
        order,
        {
          headers: {
            ['accNum']: accNum,
          },
        }
      )
      .pipe(map((res) => res.s === 'ok'));
  }
}
