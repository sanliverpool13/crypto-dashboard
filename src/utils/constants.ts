import { Symbol, SymbolInfo } from "../types/binance";

// URLs
export const BINANCE_WS_RAW_URL =
  "wss://stream.binance.com:9443/stream?streams=";
export const BINANCE_WS_STREAM_URL = "wss://stream.binance.com:9443/ws";
export const BINANCE_MULTIPLE_STREAM_URL =
  "wss://stream.binance.com:9443/stream?streams=";
export const BINANCE_API_URL = "https://api.binance.com/api/v3";

// Symbols
export const BTCUSDT = "btcusdt";
export const ETHUSDT = "ethusdt";
export const BNBUSDT = "bnbusdt";
export const AVAXUSDC = "avaxusdc";
export const AVAXUSDT = "avaxusdt";

// Map of Symbols to Individual Coins
export const SymbolMap: Record<Symbol, SymbolInfo> = {
  [Symbol.BTCUSDT]: { first: "btc", second: "usdt" },
  [Symbol.ETHUSDT]: { first: "eth", second: "usdt" },
  [Symbol.AVAXUSDT]: { first: "avax", second: "usdt" },
  [Symbol.BTCUSDC]: { first: "btc", second: "usdt" },
  [Symbol.AVAXUSDC]: { first: "avax", second: "usdc" },
  [Symbol.SOLUSDT]: { first: "sol", second: "usdt" },
};

export const SymbolList = [
  Symbol.BTCUSDT,
  Symbol.ETHUSDT,
  Symbol.AVAXUSDT,
  Symbol.BTCUSDC,
  Symbol.AVAXUSDC,
  Symbol.SOLUSDT,
];

export const Options = SymbolList.map((symbol) => ({
  value: symbol,
  label: `${SymbolMap[symbol].first.toUpperCase()}/${SymbolMap[symbol].second.toUpperCase()}`,
}));

export const themeOptions = ["light", "dark", "system"];
