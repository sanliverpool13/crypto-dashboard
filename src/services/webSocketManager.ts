import BinanceWebSocket from "../models/binanceWebSocket";
import { LastTraded, OrderBook } from "../types/binance";

export default class WebSocketManager {
  private binanceInstance: BinanceWebSocket | null = null;

  createBinanceWebSocket(
    symbol: string,
    onData: (data: OrderBook) => void,
    onTrade: (data: LastTraded) => void,
  ) {
    if (this.binanceInstance) this.binanceInstance.close();
    this.binanceInstance = new BinanceWebSocket(symbol, onData, onTrade);
  }

  closeAll() {
    this.binanceInstance?.close();
  }

  getBinanceInstance() {
    return this.binanceInstance;
  }
}
