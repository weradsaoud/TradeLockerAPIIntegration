export interface AccountDetailsContract {
    id: string,
    name: string,
    type: string,
    currency: string,
    status: string,
    tradingRules: {
        supportBrackets: boolean,
        supportTrailingStop: boolean,
        supportPartialClosePosition: boolean,
        supportSelfTrading: boolean,
        supportTradingOutOfTradingHours: boolean
      },
      riskRules: {
        maxPositionsNumber: number,
        maxPendingOrdersNumber: number,
        maxOrdersCount: number,
      }
  }