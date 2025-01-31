import { Theme } from "../types/binance";
import {
  BINANCE_API_URL,
  BINANCE_MULTIPLE_STREAM_URL,
  BINANCE_WS_STREAM_URL,
} from "./constants";

export const buildBinanceBookTickerWSStream = (symbol: string) => {
  return `${BINANCE_WS_STREAM_URL}/${symbol.toLowerCase()}@bookTicker`;
};

export const buildBinanceDepthWSStream = (symbol: string, is100ms: boolean) => {
  if (is100ms) {
    return `${BINANCE_WS_STREAM_URL}/${symbol.toLowerCase()}@depth@100ms`;
  }
  return `${BINANCE_WS_STREAM_URL}/${symbol.toLowerCase()}@depth`;
};

export const buildBinanceTradeWSStream = (symbol: string) => {
  return `${BINANCE_WS_STREAM_URL}/${symbol.toLowerCase()}@trade`;
};

export const buildBinanceDepthApiUrl = (symbol: string, limit: string) => {
  return `${BINANCE_API_URL}/depth?symbol=${symbol.toUpperCase()}&limit=${limit}`;
};

export const builBinanceDepthAndTradeStream = (symbol: string) => {
  return `${BINANCE_MULTIPLE_STREAM_URL}${symbol.toLowerCase()}@depth/${symbol.toLocaleLowerCase()}@trade`;
};

export const getTheme = () => {
  return "theme" in localStorage
    ? (localStorage.getItem("theme") as Theme)
    : Theme.system;
};
