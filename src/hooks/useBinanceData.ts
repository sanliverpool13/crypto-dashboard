import { useEffect, useState } from "react";
import { LastTraded, OrderBook } from "../types/binance";
import useBinanceWebSocket from "./useBinanceWebSocket";

export function useBinanceData(pair: string) {
  const [orderBook, setOrderBook] = useState<OrderBook | null>(null);
  const [lastTraded, setLastTraded] = useState<LastTraded | null>(null);

  const binanceInstance = useBinanceWebSocket(setOrderBook, setLastTraded);

  // useEffect(() => {
  //   if (!manager.getBinanceInstance()) {
  //     manager.createBinanceWebSocket(pair, setOrderBook, setLastTraded);
  //   }

  //   return () => {
  //     manager.removeBinanceWebSocketInstance();
  //   };
  // }, [pair]);

  useEffect(() => {
    if (!binanceInstance || !binanceInstance.isGeneralWSOpen()) return;

    // Set Up
    binanceInstance.subscribeToNewPair(pair);

    // Clean Up
    return () => {
      binanceInstance.unsubscribeStreamsWithPair(pair);
    };
  }, [pair, binanceInstance]);

  return { orderBook, lastTraded };
}
