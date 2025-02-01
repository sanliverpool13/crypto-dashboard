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

    return () => {
      manager.removeBinanceWebSocketInstance();
    };
  }, [pair]);

  // useEffect(() => {
  //   const binanceInstance = manager.getBinanceInstance();
  //   console.log("binance instance", binanceInstance);

  //   if (!binanceInstance) {
  //     console.log("create binance instance and web socket");
  //     manager.createBinanceWebSocket(pair, setOrderBook, setLastTraded);
  //   } else {
  //     console.log("update streams");
  //     manager.updateStreams(pair);
  //   }

  //   return () => {
  //     manager.removeStream();
  //   };
  // }, [pair]);

  return { orderBook, lastTraded };
}
