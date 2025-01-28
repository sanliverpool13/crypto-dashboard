import { LastTraded, OrderBook } from "../types/binance";
import {
  buildBinanceDepthApiUrl,
  buildBinanceDepthWSStream,
  buildBinanceTradeWSStream,
} from "../utils/helpers";
import BinanceOrderBook from "./binanceOrderBook";

export default class BinanceWebSocket {
  private wsDepth: WebSocket;
  private wsTrade: WebSocket;
  private pair: string;
  private onOrderBookUpdate: (data: OrderBook) => void;
  private onLastTrade: (data: LastTraded) => void;
  private orderBook: BinanceOrderBook;
  private lastTradedPrice: number | null = null;

  constructor(
    symbol: string,
    onOrderBookUpdate: (data: OrderBook) => void,
    onLastTrade: (data: LastTraded) => void,
  ) {
    this.wsDepth = new WebSocket(buildBinanceDepthWSStream(symbol, false));
    this.wsTrade = new WebSocket(buildBinanceTradeWSStream(symbol));

    this.onOrderBookUpdate = onOrderBookUpdate;
    this.onLastTrade = onLastTrade;
    this.pair = symbol;
    this.orderBook = new BinanceOrderBook();
    this.initializeDepthWebSocket();
    this.initializeWebSocket();
  }

  private initializeDepthWebSocket() {
    console.log("initializing websocket");

    this.wsDepth.onopen = () => {
      console.log("web socket opened");

      this.wsDepth.onmessage = this.onMessage;
      this.fetchDepthSnapshot();
    };
  }

  private initializeWebSocket() {
    console.log("initializing websocket");

    this.wsTrade.onopen = () => {
      console.log("trade web socket opened");

      this.wsTrade.onmessage = this.onMessageTrade;
    };
  }

  private filterOrderBook(orderBook: OrderBook) {
    const { asks, bids } = orderBook;

    // sort bids (buy orders) in descending order
    const sortedBids = bids.sort((a, b) => {
      return parseFloat(b[0]) - parseFloat(a[0]);
    });

    // sort asks (sell orders) in ascending order
    const sortedAsks = asks.sort((a, b) => {
      return parseFloat(a[0]) - parseFloat(b[0]);
    });

    return { bids: sortedBids.slice(0, 10), asks: sortedAsks.slice(0, 10) };
  }

  private onMessageTrade = (data: MessageEvent) => {
    const { type, data: message } = data;
    if (type === "message") {
      const parsedData = JSON.parse(message);
      this.lastTradedPrice = parseFloat(parsedData.p);

      this.onLastTrade({
        lastTradedPrice: this.lastTradedPrice,
        lastTradedQuantity: parseFloat(parsedData.q),
      });
      // switch (parsedData.stream) {
      //   case `${this.pair.toLowerCase()}@trade`:
      //     console.log("trade");
      //     this.lastTradedPrice = parseFloat(parsedData.data.p);
      //     break;
      //   case `${this.pair.toLowerCase()}@depth`:
      //     this.handleDepthUpdate(parsedData.data);
      //     break;
      //   default:
      //     break;
      // }
      // this.lastTradedPrice = parseFloat(parsedData.p);
    }
  };

  // private handleDepthUpdate = (data: any) => {
  //   if (this.orderBook.lastUpdateId === 0) {
  //     console.log("order book not initialized");
  //     this.orderBook.addToBuffer(data);
  //   } else {
  //     console.log("order book initialized");
  //     // check if valid snapshot
  //     // process the order event
  //     const resultOfProcess = this.orderBook.processOrderEvent(data);
  //     if (!resultOfProcess) {
  //       console.log("processed order event error");
  //       this.orderBook.addToBuffer(data);
  //       this.fetchDepthSnapshot();
  //       return;
  //     }
  //   }

  //   this.onOrderBookUpdate(this.filterOrderBook(this.orderBook.getOrderBook()));
  // };

  private onMessage = (data: MessageEvent) => {
    const { type, data: message } = data;

    const parsedData = JSON.parse(message);

    if (type === "message") {
      // Order book not initialized or set
      if (this.orderBook.lastUpdateId === 0) {
        console.log("order book not initialized");
        this.orderBook.addToBuffer(parsedData);
      } else {
        console.log("order book initialized");
        // check if valid snapshot
        // process the order event
        const resultOfProcess = this.orderBook.processOrderEvent(parsedData);
        if (!resultOfProcess) {
          console.log("processed order event error");
          this.orderBook.addToBuffer(parsedData);
          this.fetchDepthSnapshot();
          return;
        }
      }
    }

    this.onOrderBookUpdate(this.filterOrderBook(this.orderBook.getOrderBook()));
  };

  close() {
    this.wsDepth?.close();
  }

  async fetchDepthSnapshot() {
    console.log("fetching depth snapshot");
    const apiUrl = buildBinanceDepthApiUrl(this.pair, "5000");
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch depth snapshot");
      }
      const snapshot = await response.json();
      console.log("snapshot", snapshot);
      // check if valid snapshot
      if (!this.orderBook.isSnapshotValid(snapshot.lastUpdateId)) {
        console.log("snapshot is not valid");
        // trigger new snapshot
        this.fetchDepthSnapshot();
        return;
      }

      // filter events from orderbook
      this.orderBook.filterOrderEventsBuffer(snapshot.lastUpdateId);
      // set snapshot
      this.orderBook.setOrderBook(snapshot);

      console.log("order events accumulated", this.orderBook.orderEventsBuffer);

      for (const event of this.orderBook.orderEventsBuffer) {
        const resultOfProcess = this.orderBook.processOrderEvent(event);
        if (!resultOfProcess) {
          console.log("processed order event error");
          this.fetchDepthSnapshot();
          return;
        }
      }

      // processed orders successfully, empty the buffer
      this.orderBook.orderEventsBuffer = [];

      // set data
      console.log("setting data after snapshot");
      this.onOrderBookUpdate(
        this.filterOrderBook(this.orderBook.getOrderBook()),
      );
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Failed to fetch depth snapshot: ${error.message}`);
      } else {
        console.error("Failed to fetch depth snapshot: Unknown error");
      }
      throw error;
    }
  }
}
