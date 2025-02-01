import React, { useEffect, useState } from "react";
import BinanceWebSocket from "../models/binanceWebSocket";
import { OrderBook, LastTraded } from "../types/binance";

const useBinanceWebSocket = (
  setOrderBook: React.Dispatch<React.SetStateAction<OrderBook | null>>,
  setLastTraded: React.Dispatch<React.SetStateAction<LastTraded | null>>,
) => {
  const [binanceInstance, setBinanceInstance] =
    useState<BinanceWebSocket | null>(null);

  useEffect(() => {
    const instance = new BinanceWebSocket(setOrderBook, setLastTraded);
    setBinanceInstance(instance);
    return () => {
      instance.close();
    };
  }, [setOrderBook, setLastTraded]);

  return binanceInstance;
};

export default useBinanceWebSocket;
