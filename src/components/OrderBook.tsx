import { useEffect, useRef, useState } from "react";
import { PriceLevel, Symbol } from "../types/binance";
import { SymbolMap } from "../utils/constants";

interface OrderBookProps {
  data: {
    orderBook: {
      asks: PriceLevel[];
      bids: PriceLevel[];
    } | null;
    lastTraded: {
      lastTradedPrice: number;
    } | null;
  };
  symbol: Symbol;
}

const OrderBook: React.FC<OrderBookProps> = ({ data, symbol }) => {
  const coin = SymbolMap[symbol].first.toUpperCase();
  const quote = SymbolMap[symbol].second.toUpperCase();

  const [lastPriceDirection, setLastPriceDirection] = useState<string | null>(
    null,
  ); // 'up' or 'down'
  const previousPrice = useRef<number | undefined>(undefined); // Track the previous price

  const { orderBook, lastTraded } = data;

  // if (!orderBook && !lastTraded) return <div>Loading...</div>;

  const { bids, asks } = orderBook || {};
  const { lastTradedPrice } = lastTraded || {};

  // Update price direction on price change
  useEffect(() => {
    if (previousPrice.current !== null && lastTradedPrice !== undefined) {
      if (lastTradedPrice > previousPrice.current!) {
        setLastPriceDirection("up");
      } else if (lastTradedPrice < previousPrice.current!) {
        setLastPriceDirection("down");
      }
    }

    previousPrice.current = lastTradedPrice;
  }, [lastTradedPrice]);

  return (
    <div className="w-full flex items-center lg:justify-end justify-start lg:flex-grow ">
      <div className=" lg:w-[500px] sm:w-4/5 w-full bg-[#F8F8F8] dark:bg-[#393939] rounded-lg lg:p-4 p-2 border border-1 border-grey dark:border-[#AFAFAF]">
        <table className="w-full table-fixed">
          <thead>
            <tr className="text-sm text-gray-600 dark:text-[#AFAFAF]">
              <th className="text-left pb-4">Price ({quote})</th>
              <th className="text-right pb-4">Amount ({coin})</th>
              <th className="text-right pb-4">Total ({quote})</th>
            </tr>
          </thead>
          <tbody>
            {asks &&
              asks.map((order: PriceLevel, index: number) => (
                <tr key={index} className="mt-4">
                  <td className="text-red-600 dark:text-[#FF4F4F] text-left">
                    {parseFloat(order[0]).toFixed(2)}
                  </td>
                  <td className="text-right">
                    {parseFloat(order[1]).toFixed(5)}
                  </td>
                  <td className="text-right">
                    {(parseFloat(order[0]) * parseFloat(order[1])).toFixed(5)}
                  </td>
                </tr>
              ))}

            {/* Gap Before Current Price */}
            <tr>
              <td colSpan={3} className="py-2"></td>
            </tr>

            {/* Current Price Row */}

            <tr>
              <td colSpan={3} className="font-bold">
                <span
                  className={`text-xl ${
                    lastPriceDirection === "up"
                      ? "text-green-600 dark:text-[#5EC23B]"
                      : "text-red-600 dark:text-[#FF4F4F]"
                  }`}
                >
                  {lastTraded && lastTradedPrice?.toFixed(2)}
                </span>
                <span
                  className={`mr-2 ${
                    lastPriceDirection === "up"
                      ? "text-green-600 dark:text-[#5EC23B]"
                      : "text-red-600 dark:text-[#FF4F4F]"
                  }`}
                >
                  {lastTraded && (lastPriceDirection === "up" ? "↑" : "↓")}
                </span>
                <span className="text-gray-600 dark:text-[#AFAFAF]">
                  {lastTraded && `$${lastTradedPrice?.toFixed(2)}`}
                </span>
              </td>
            </tr>

            {/* Gap Before Current Price */}
            <tr>
              <td colSpan={3} className="py-2"></td>
            </tr>

            {bids &&
              bids.map((order: PriceLevel, index: number) => (
                <tr key={index}>
                  <td className="text-green-600 dark:text-[#5EC23B] text-left">
                    {parseFloat(order[0]).toFixed(2)}
                  </td>
                  <td className="text-right">
                    {parseFloat(order[1]).toFixed(5)}
                  </td>
                  <td className="text-right">
                    {(parseFloat(order[0]) * parseFloat(order[1])).toFixed(5)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderBook;
