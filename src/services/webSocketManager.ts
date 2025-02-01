import BinanceWebSocket from "../models/binanceWebSocket";
import { LastTraded, OrderBook } from "../types/binance";

export default class WebSocketManager {
  private binanceInstance: BinanceWebSocket | null = null;

  createBinanceWebSocket(
    symbol: string,
    onData: (data: OrderBook) => void,
    onTrade: (data: LastTraded | null) => void,
  ) {
    if (this.binanceInstance) this.binanceInstance.close();
    this.binanceInstance = new BinanceWebSocket(symbol, onData, onTrade);
  }

  updateStreams(symbol: string) {
    if (!this.binanceInstance) return;
    this.binanceInstance?.updateSymbol(symbol);
  }

  removeBinanceWebSocketInstance() {
    this.binanceInstance?.close();
    this.binanceInstance = null;
  }

  removeStream() {
    this.binanceInstance?.removeStreams();
  }

  closeAll() {
    this.binanceInstance?.close();
  }

  getBinanceInstance() {
    return this.binanceInstance;
  }
}
