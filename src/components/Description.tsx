import { BTCUSDT, SymbolMap } from "../utils/constants";

const Description = () => {
  const symbol = BTCUSDT;
  const coin = SymbolMap[symbol].first.toUpperCase();
  const quote = SymbolMap[symbol].second.toUpperCase();
  return (
    <div className="flex flex-col lg:gap-8 gap-4 lg:flex-grow">
      <h1 className="text-2xl font-bold lg:mb-8">
        Order Book - {`${coin}/${quote}`}
      </h1>

      {/* <div>
        <h2 className="text-gray-500 font-semibold">Current Price</h2>
        <p className="font-bold">$36.69</p>
      </div> */}
      <div>
        <p>
          <span className="text-red-600">Red</span> Prices Are Sell Orders
        </p>
        <p>
          <span className="text-green-600">Green</span> Prices Are Buy Orders
        </p>
      </div>
      <div>
        <h2 className="text-gray-500 font-semibold">Description</h2>
        <p>
          This is a simple order book that displays the buy and sell orders for
          a given trading pair.
        </p>
        <p>
          The last traded price (current price) is in the middle of the table.
        </p>
        <p>
          The order book is updated in real-time using the Binance WebSocket
          API.
        </p>
      </div>
    </div>
  );
};

export default Description;
