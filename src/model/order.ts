import { Validators } from "@angular/forms";

export class Order {
  /**
   *
   */
  constructor() {}

  price!: number;
  qty!: number;
  routeId!: 9912 | 452;
  side!: 'buy' | 'sell';
  stopLoss!: number;
  stopLossType!: 'absolute' | 'offset' | 'trailingOffset';
  stopPrice!: number;
  takeProfit!: number;
  takeProfitType!: 'absolute' | 'offset';
  trStopOffset!: number;
  tradableInstrumentId!: number;
  type!: 'limit' | 'market' | 'stop';
  validity!: 'GTC' | 'IOC';

  buildForm(controls = false): object {
    const {
      price,
      qty,
      routeId,
      side,
      stopLoss,
      stopLossType,
      stopPrice,
      takeProfit,
      takeProfitType,
      trStopOffset,
      tradableInstrumentId,
      type,
      validity,
    } = this;
    return {
        price: controls
        ? [
            price,
            [
              Validators.required,
            ],
          ]
        : price,
        qty: controls
        ? [
            qty,
            [
                Validators.required,
            ],
          ]
        : qty,
        routeId: controls
        ? [
            routeId,
            [
                Validators.required,
            ],
          ]
        : routeId,
        side: controls
        ? [
            side,
            [
                Validators.required,
            ],
          ]
        : side,
        stopLoss: controls
        ? [
            stopLoss,
            [],
          ]
        : stopLoss,
        stopLossType: controls
        ? [
            stopLossType,
            [],
          ]
        : stopLossType,
        stopPrice: controls
        ? [
            stopPrice,
            [],
          ]
        : stopPrice,
        takeProfit: controls
        ? [
            takeProfit,
            [],
          ]
        : takeProfit,
        takeProfitType: controls
        ? [
            takeProfitType,
            [],
          ]
        : takeProfitType,
        trStopOffset: controls
        ? [
            trStopOffset,
            [],
          ]
        : trStopOffset,
        tradableInstrumentId: controls
        ? [
            tradableInstrumentId,
            [Validators.required],
          ]
        : tradableInstrumentId,
        type: controls
        ? [
            type,
            [Validators.required],
          ]
        : type,
        validity: controls
        ? [
            validity,
            [Validators.required],
          ]
        : validity,
    };
  }
}
