import {
  BinanceOrderEvent,
  LastTraded,
  OrderBook,
  Symbol,
} from "../types/binance";
import { BINANCE_WS_RAW_URL } from "../utils/constants";
import { buildBinanceDepthApiUrl } from "../utils/helpers";
import BinanceOrderBook from "./binanceOrderBook";

export default class BinanceWebSocket {
  private generalWS: WebSocket;
  // private streams: Set<string>;
  private pair: string;
  private onOrderBookUpdate: (data: OrderBook) => void;
  private onLastTrade: (data: LastTraded | null) => void;
  private orderBook: BinanceOrderBook;
  private lastTradedPrice: number | null = null;

  constructor(
    onOrderBookUpdate: (data: OrderBook) => void,
    onLastTrade: (data: LastTraded | null) => void,
  ) {
    this.generalWS = new WebSocket(BINANCE_WS_RAW_URL);
    this.pair = Symbol.BTCUSDT;
    // this.streams = new Set([
    //   `${symbol.toLowerCase()}@depth`,
    //   `${symbol.toLowerCase()}@trade`,
    // ]);
    this.onOrderBookUpdate = onOrderBookUpdate;
    this.onLastTrade = onLastTrade;
    // this.pair = symbol;
    this.orderBook = new BinanceOrderBook();

    this.initializeGeneralWebSocket();
  }

  public isGeneralWSOpen() {
    return this.generalWS.readyState === WebSocket.OPEN;
  }

  private initializeGeneralWebSocket() {
    this.generalWS.onopen = () => {
      console.log("web socket open");
      this.subscribeStreamsWithPair(this.pair);
      this.fetchDepthSnapshot();
    };

    this.generalWS.onmessage = (message: MessageEvent) => {
      this.onMessageGeneral(message);
    };

    this.generalWS.onclose = () => {
      console.log("WebSocket connection closed");
    };

    this.generalWS.onerror = (error) => {
      console.error("WebSocket error", error);
    };
  }

  onMessageGeneral(message: MessageEvent) {
    // console.log(`message ${message}`);
    const { data } = message;
    const dataParsed = JSON.parse(data);

    console.log("on message general");

    const lowerCasePair = this.pair.toLowerCase();

    switch (dataParsed.stream) {
      case `${lowerCasePair}@depth`:
        this.handleDepth(dataParsed.data as BinanceOrderEvent);
        return;
      case `${lowerCasePair}@trade`:
        this.lastTradedPrice = parseFloat(dataParsed.data.p);
        this.onLastTrade({
          lastTradedPrice: this.lastTradedPrice,
          lastTradedQuantity: parseFloat(dataParsed.data.q),
        });
        return;
      default:
        return;
    }
  }

  private handleDepth(data: BinanceOrderEvent) {
    // Order book not initialized or set
    if (this.orderBook.lastUpdateId === 0) {
      this.orderBook.addToBuffer(data);
    } else {
      // check if valid snapshot
      // process the order event
      const resultOfProcess = this.orderBook.processOrderEvent(data);
      if (!resultOfProcess) {
        this.orderBook.addToBuffer(data);
        this.fetchDepthSnapshot();
        return;
      }
    }

    this.onOrderBookUpdate(this.filterOrderBook(this.orderBook.getOrderBook()));
  }

  // If only one stream then array of one
  // public subscribeStreams(streams: string[]) {
  //   const lowerCasedSymbols = streams.map((stream) => stream.toLowerCase());
  //   lowerCasedSymbols.forEach((stream) => this.streams.add(stream));
  //   this.generalWS.send(
  //     JSON.stringify({
  //       method: "SUBSCRIBE",
  //       params: streams,
  //       id: Date.now(),
  //     }),
  //   );
  //   console.log(`Subscribed to streams ${streams}`);
  // }

  public subscribeToNewPair(symbol: string) {
    this.unsubscribeStreamsWithPair(this.pair);
    this.subscribeStreamsWithPair(symbol);
    this.pair = symbol;
    this.lastTradedPrice = null;
    this.onLastTrade(null);
    this.orderBook.discardOrderBook();
    this.fetchDepthSnapshot();
  }

  public getStreamsFromPair(symbol: string) {
    return [`${symbol}@depth`, `${symbol}@trade`];
  }

  public subscribeStreamsWithPair(symbol: string) {
    const newStreams = this.getStreamsFromPair(symbol);
    const lowerCasedSymbols = newStreams.map((s) => s.toLowerCase());
    // lowerCasedSymbols.forEach((stream) => this.streams.add(stream));
    this.generalWS.send(
      JSON.stringify({
        method: "SUBSCRIBE",
        params: lowerCasedSymbols,
        id: Date.now(),
      }),
    );
    console.log(`Subscribed to streams ${newStreams}`);
  }

  // public unsubscribeStreams(streamsToRemove: string[]) {
  //   const loweredCaseStreamsToRemove = streamsToRemove.map((s) =>
  //     s.toLowerCase(),
  //   );
  //   const filteredStreams = new Set(
  //     [...this.streams].filter(
  //       (stream) => !loweredCaseStreamsToRemove.includes(stream),
  //     ),
  //   );

  //   this.streams = filteredStreams;

  //   this.generalWS.send(
  //     JSON.stringify({
  //       method: "UNSUBSCRIBE",
  //       params: loweredCaseStreamsToRemove,
  //       id: Date.now(),
  //     }),
  //   );
  //   console.log(`streams were removed ${loweredCaseStreamsToRemove}`);
  // }

  public unsubscribeStreamsWithPair(symbol: string) {
    const streamsToRemove = this.getStreamsFromPair(symbol);
    const loweredCaseStreamsToRemove = streamsToRemove.map((s) =>
      s.toLowerCase(),
    );
    // const filteredStreams = new Set(
    //   [...this.streams].filter(
    //     (stream) => !loweredCaseStreamsToRemove.includes(stream),
    //   ),
    // );

    // this.streams = filteredStreams;

    this.generalWS.send(
      JSON.stringify({
        method: "UNSUBSCRIBE",
        params: loweredCaseStreamsToRemove,
        id: Date.now(),
      }),
    );
    console.log(`streams were removed ${loweredCaseStreamsToRemove}`);
  }

  // public updateSymbol(newPair: string) {
  //   const oldStreams = [
  //     `${this.pair.toLowerCase()}@depth`,
  //     `${this.pair.toLowerCase()}@trade`,
  //   ];
  //   const newStreams = [
  //     `${newPair.toLowerCase()}@depth`,
  //     `${newPair.toLowerCase()}@trade`,
  //   ];
  //   this.pair = newPair.toLowerCase();

  //   this.unsubscribeStreams(oldStreams);
  //   this.subscribeStreams(newStreams);
  //   this.resetOrderBook();
  // }

  // public removeStreams() {
  //   if (!this.isGeneralWSOpen()) return;
  //   this.unsubscribeStreams([...this.streams]);
  // }

  // public getStreams() {
  //   return [...this.streams];
  // }

  // private resetOrderBook() {
  //   this.orderBook.discardOrderBook();
  //   this.fetchDepthSnapshot();
  // }

  // private initializeDepthWebSocket() {
  //   this.wsDepth.onopen = () => {
  //     this.wsDepth.onmessage = this.onMessage;
  //     this.fetchDepthSnapshot();
  //   };
  // }

  // private initializeWebSocket() {
  //   this.wsTrade.onopen = () => {
  //     this.wsTrade.onmessage = this.onMessageTrade;
  //   };
  // }

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

  // private onMessageTrade = (data: MessageEvent) => {
  //   const { type, data: message } = data;
  //   if (type === "message") {
  //     const parsedData = JSON.parse(message);
  //     this.lastTradedPrice = parseFloat(parsedData.p);

  //     this.onLastTrade({
  //       lastTradedPrice: this.lastTradedPrice,
  //       lastTradedQuantity: parseFloat(parsedData.q),
  //     });
  //   }
  // };

  // private onMessage = (data: MessageEvent) => {
  //   const { type, data: message } = data;

  //   const parsedData = JSON.parse(message);

  //   if (type === "message") {
  //     // Order book not initialized or set
  //     if (this.orderBook.lastUpdateId === 0) {
  //       this.orderBook.addToBuffer(parsedData);
  //     } else {
  //       // check if valid snapshot
  //       // process the order event
  //       const resultOfProcess = this.orderBook.processOrderEvent(parsedData);
  //       if (!resultOfProcess) {
  //         this.orderBook.addToBuffer(parsedData);
  //         this.fetchDepthSnapshot();
  //         return;
  //       }
  //     }
  //   }

  //   this.onOrderBookUpdate(this.filterOrderBook(this.orderBook.getOrderBook()));
  // };

  close() {
    this.resetState();
    this.generalWS?.close();
    // this.wsDepth?.close();
    // this.wsTrade?.close();
  }

  resetState() {
    // reset orderbook, and the last trading data
    this.lastTradedPrice = null;
    this.onLastTrade(null);
  }

  async fetchDepthSnapshot() {
    const apiUrl = buildBinanceDepthApiUrl(this.pair, "5000");
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch depth snapshot");
      }
      const snapshot = await response.json();
      // check if valid snapshot
      if (!this.orderBook.isSnapshotValid(snapshot.lastUpdateId)) {
        // trigger new snapshot
        this.fetchDepthSnapshot();
        return;
      }

      // filter events from orderbook
      this.orderBook.filterOrderEventsBuffer(snapshot.lastUpdateId);
      // set snapshot
      this.orderBook.setOrderBook(snapshot);

      for (const event of this.orderBook.orderEventsBuffer) {
        const resultOfProcess = this.orderBook.processOrderEvent(event);
        if (!resultOfProcess) {
          this.fetchDepthSnapshot();
          return;
        }
      }

      // processed orders successfully, empty the buffer
      this.orderBook.orderEventsBuffer = [];

      // set data
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
