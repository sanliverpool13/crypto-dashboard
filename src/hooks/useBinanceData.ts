import { useEffect, useState } from "react";
import WebSocketManager from "../services/webSocketManager";
import { LastTraded, OrderBook } from "../types/binance";

const manager = new WebSocketManager();

export function useBinanceData(pair: string) {
  console.log("useBinanceData called");
  const [orderBook, setOrderBook] = useState<OrderBook | null>(null);
  const [lastTraded, setLastTraded] = useState<LastTraded | null>(null);

  useEffect(() => {
    console.log("useEffect called");
    manager.createBinanceWebSocket(pair, setOrderBook, setLastTraded);

    return () => {
      manager.closeAll(); // Cleanup on unmount
    };
  }, [pair]);

  return { orderBook, lastTraded };
}
