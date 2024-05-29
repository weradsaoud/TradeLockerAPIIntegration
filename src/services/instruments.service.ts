import { Injectable, inject } from '@angular/core';
import { EndPoints, EndpointsType } from '../constants/endpoints';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { InstrumentContract } from '../contracts/instrument-contract';
import { HttpClient } from '@angular/common/http';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class InstrumentsService {
  private readonly http = inject(HttpClient);
  private readonly tokenService = inject(TokenService);
  constructor() {}

  endpoints: EndpointsType = EndPoints;
  instruments$ = new BehaviorSubject<InstrumentContract[]>([]);
  currentInstrument: InstrumentContract | null = null;
  selectInstrument$ = new BehaviorSubject<InstrumentContract | null>(null);

  getInstruments(accNum: string, accId: number): Observable<InstrumentContract[]> {
    return this.http
      .get<{ s: String; d: { instruments: InstrumentContract[] } }>(
        this.endpoints.BASE_URL + this.endpoints.INSTRUMENTS_URL(accId.toString()),
        {headers:{
          ['accNum']: accNum
        }}
      )
      .pipe(
        map((res) => res.d.instruments),
        tap((instruments) => {
          this.instruments$.next(instruments);
          if(!!instruments.length){
            //this.selectInstrument$.next(instruments[0]);
            //this.currentInstrument = instruments[0];
          }
        })
      );
  }
}
