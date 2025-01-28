export interface BinanceOrderEvent {
  e: string;
  E: number;
  s: string;
  U: number;
  u: number;
  b: PriceLevel[];
  a: PriceLevel[];
}

export type PriceLevel = [string, string]; // [price, quantity]

export interface BinanceDepthSnapshot {
  lastUpdateId: number;
  bids: PriceLevel[];
  asks: PriceLevel[];
}

export interface OrderBook {
  bids: PriceLevel[];
  asks: PriceLevel[];
}

export interface LastTraded {
  lastTradedPrice: number;
  lastTradedQuantity: number;
}
