// URLs
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
export const SymbolMap = {
  btcusdt: { first: "btc", second: "usdt" },
  ethusdt: { first: "eth", second: "usdt" },
  bnbusdt: { first: "bnb", second: "usdt" },
  avaxusdc: { first: "avax", second: "usdc" },
  avaxusdt: { first: "avax", second: "usdt" },
};
