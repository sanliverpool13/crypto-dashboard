import BinanceWebSocket from "../models/binanceWebSocket";
import BinanceOrderBook from "../models/binanceOrderBook";
import { BTCUSDT } from "../utils/constants";

export default class WebSocketManager {
  private binanceInstance: BinanceWebSocket | null = null;
  private binanceOrderBookInstance: BinanceOrderBook | null = null;

  createBinanceWebSocket(
    symbol: string,
    onData: (data: any) => void,
    onTrade: (data: any) => void,
  ) {
    if (this.binanceInstance) this.binanceInstance.close();
    this.binanceInstance = new BinanceWebSocket(symbol, onData, onTrade);
  }

  createBinanceOrderBook() {
    this.binanceOrderBookInstance = new BinanceOrderBook();
  }

  closeAll() {
    this.binanceInstance?.close();
  }

  getBinanceInstance() {
    return this.binanceInstance;
  }
}
