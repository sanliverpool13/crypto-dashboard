import { useEffect, useState } from "react";
import WebSocketManager from "../services/webSocketManager";
import { LastTraded, OrderBook } from "../types/binance";

const manager = new WebSocketManager();

export function useBinanceData(pair: string) {
  const [orderBook, setOrderBook] = useState<OrderBook | null>(null);
  const [lastTraded, setLastTraded] = useState<LastTraded | null>(null);

  useEffect(() => {
    if (!manager.getBinanceInstance()) {
      manager.createBinanceWebSocket(pair, setOrderBook, setLastTraded);
    }

    if (
      manager.getBinanceInstance() &&
      manager.getBinanceInstance()?.isGeneralWSOpen()
    ) {
      manager.updateStreams(pair);
    }

    return () => {
      manager.closeAll(); // Cleanup on unmount
    };
  }, [pair]);

  return { orderBook, lastTraded };
}
