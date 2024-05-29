export interface InstrumentContract {
  tradableInstrumentId: number;
  id: number;
  name: string;
  description: string;
  type: string;
  tradingExchange: string;
  marketDataExchange: string;
  country: string;
  logoUrl: string;
  localizedName: string;
  barSource: string;
  hasIntraday: boolean;
  hasDaily: boolean;
}
