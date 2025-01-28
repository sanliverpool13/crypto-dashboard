import {
  BinanceDepthSnapshot,
  BinanceOrderEvent,
  OrderBook,
} from "../types/binance";

class BinanceOrderBook {
  public orderEventsBuffer: BinanceOrderEvent[];
  public lastUpdateId: number;
  public orderBook: OrderBook;
  public isOrderBookProcessed: boolean = false;
  public snapshotArray: BinanceDepthSnapshot[] = [];

  constructor() {
    this.orderEventsBuffer = [];
    this.lastUpdateId = 0;

    this.orderBook = {
      bids: [],
      asks: [],
    };
  }

  public addToBuffer(orderEvent: BinanceOrderEvent) {
    this.orderEventsBuffer.push(orderEvent);
    // console.log("order events reference", this.orderEventsBuffer);
    console.log("order events copy", [...this.orderEventsBuffer]);
    // console.log("order book reference", this.orderBook);
    console.log("order book copy", { ...this.orderBook });
  }

  public addSnapshot(snapshot: BinanceDepthSnapshot) {
    this.snapshotArray.push(snapshot);
    console.log("snapshots", this.snapshotArray);
  }

  public getLastUpdateId() {
    return this.lastUpdateId;
  }

  public setLastUpdateId(lastUpdateId: number) {
    console.log("set last update id", lastUpdateId);
    this.lastUpdateId = lastUpdateId;
  }

  public isSnapshotValid(snapshotUpdatedId: number) {
    console.log("is snapshot valid");
    if (this.orderEventsBuffer.length === 0) {
      console.log("no order events, it's valid");
      return true;
    }
    return snapshotUpdatedId >= this.orderEventsBuffer[0].U;
  }

  public filterOrderEventsBuffer(lastUpdateId: number) {
    // filter for events that are valid.
    const validOrderEventsBuffer = this.orderEventsBuffer.filter(
      (orderEvent) => {
        return orderEvent.u > lastUpdateId;
      },
    );

    console.log("filtered order events", validOrderEventsBuffer);

    // set order events to valid Order Events
    this.orderEventsBuffer = validOrderEventsBuffer;
  }

  public setOrderBook(snapshot: BinanceDepthSnapshot) {
    console.log("Order Book set");
    this.orderBook = { bids: snapshot.bids, asks: snapshot.asks };
    this.lastUpdateId = snapshot.lastUpdateId;
  }

  public getOrderBook() {
    return this.orderBook;
  }

  public discardOrderBook() {
    this.orderBook = { bids: [], asks: [] };
    this.lastUpdateId = 0;
    this.orderEventsBuffer = [];
  }

  public processOrderEventsBuffer(): boolean {
    for (const event of this.orderEventsBuffer) {
      this.processOrderEvent(event);
    }

    // set last update id to the last update id of the last event
    return true;
  }

  public processOrderEvent(event: BinanceOrderEvent) {
    console.log("processing order event", event);
    const { U: firstUpdateId, u: lastUpdateId, b: bids, a: asks } = event;

    // if last update of this is smaller than the last update id of order book, ignore this event
    // this means that this event has already been processed
    // we need to remove it from the list of order events
    if (lastUpdateId <= this.lastUpdateId) {
      // skip for now
      return true;
    }
    // if the first update id is larger than order book last update id, then somthing went wrong, restart
    if (firstUpdateId > this.lastUpdateId + 1) {
      console.log(
        `first update id ${firstUpdateId} is larger than order book last update id ${this.lastUpdateId}`,
      );
      // restart process of initializing order book
      this.discardOrderBook();
      console.log(
        "order book discarded, orderbook, order event",
        this.orderBook,
        this.orderEventsBuffer,
      );
      return false;
    }

    // // take a look at bids
    // this.orderBook.bids = this.updatePriceLevels(this.orderBook.bids, bids);

    // // take a look at asks
    // this.orderBook.asks = this.updatePriceLevels(this.orderBook.asks, asks);

    this.orderBook = {
      ...this.orderBook,
      bids: this.updatePriceLevelsMap(this.orderBook.bids, bids),
      asks: this.updatePriceLevelsMap(this.orderBook.asks, asks),
    };

    this.setLastUpdateId(lastUpdateId);

    return true;
  }

  public setToLastEventUpdateId() {
    this.lastUpdateId =
      this.orderEventsBuffer[this.orderEventsBuffer.length - 1].u;
  }

  private updatePriceLevels(
    orderBookPriceLevels: [string, string][],
    priceLevels: [string, string][],
  ) {
    // Copy orderBook price levels
    const updatedPriceLevels = [...orderBookPriceLevels];

    // Iterate through price levels
    priceLevels.forEach(([price, quantity]) => {
      // Find index of price in snapshot price levels
      const priceIndex = updatedPriceLevels.findIndex(
        ([orderBookPrice]) => orderBookPrice === price,
      );

      // If quantity is 0, remove price level
      if (parseFloat(quantity) === 0) {
        console.log(
          `quantity is 0, price is: ${price}, orderbook price index is: ${priceIndex}, order book price: ${updatedPriceLevels[priceIndex]}`,
        );
        // If price exists in orderbook price levels, remove it
        if (priceIndex !== -1) {
          console.log(`price exists in order book price levels, remove it`);
          updatedPriceLevels.splice(priceIndex, 1);
          console.log("updated price levels", updatedPriceLevels);
        }
      } else {
        console.log(
          `quantity is not 0, it is: ${quantity}, and price index is: ${priceIndex}`,
        );
        if (priceIndex !== -1) {
          console.log("price index exists in order book price levels", price);
          updatedPriceLevels[priceIndex] = [price, quantity];
        } else {
          console.log("price index does not exist in order book price levels");
          updatedPriceLevels.push([price, quantity]);
        }
      }
    });

    return updatedPriceLevels;
  }

  private updatePriceLevelsMap(
    orderBookPriceLevels: [string, string][],
    priceLevels: [string, string][],
  ) {
    // Create a map of orderBook price levels
    const orderBookPriceLevelsMap = new Map(orderBookPriceLevels);

    // Iterate through price levels
    priceLevels.forEach(([price, quantity]) => {
      // If quantity is 0, remove price level
      if (parseFloat(quantity) === 0) {
        orderBookPriceLevelsMap.delete(price);
      } else {
        orderBookPriceLevelsMap.set(price, quantity);
      }
    });

    // Convert map to array
    return Array.from(orderBookPriceLevelsMap);
  }
}

export default BinanceOrderBook;
