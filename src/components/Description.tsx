import { LastTraded, Symbol } from "../types/binance";
import { SymbolMap } from "../utils/constants";
import Dropdown from "./DropDown";
import { Options as options } from "../utils/constants";
import { getSymbolOptionsMap } from "../utils/helpers";

interface DescriptionProps {
  symbol: Symbol;
  lastTraded: LastTraded | null;
  setSymbol: (symbol: Symbol) => void;
}

const optionsMap = getSymbolOptionsMap(options);

const Description: React.FC<DescriptionProps> = ({
  symbol,
  lastTraded,
  setSymbol,
}) => {
  const coin = SymbolMap[symbol].first.toUpperCase();
  const quote = SymbolMap[symbol].second.toUpperCase();
  return (
    <div className="flex flex-col lg:gap-24 gap-4 lg:flex-grow">
      <section className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold lg:mb-8">
          Order Book - {`${coin}/${quote}`}
        </h1>
        <Dropdown options={optionsMap} setSymbol={setSymbol} symbol={symbol} />
        <div>
          <h2 className="text-gray-500 dark:text-[#AFAFAF] font-semibold">
            Current Price
          </h2>
          <p className="font-bold">
            {lastTraded ? `$${lastTraded.lastTradedPrice.toFixed(2)}` : ""}
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-gray-500 dark:text-[#AFAFAF] font-semibold">
            Description
          </h2>
          <p>
            A simple order book that displays the buy and sell orders for a
            given trading pair.
          </p>
          <p>
            The last traded price (current price) is in the middle of the table.
          </p>
          <p>The order book is updated in real-time using the Binance API.</p>
        </div>
        <div>
          <p>
            <span className="text-red-600">Red</span>{" "}
            <span className="text-gray-500 dark:text-[#AFAFAF]">
              Prices Are Sell Orders
            </span>
          </p>
          <p>
            <span className="text-green-600">Green</span>{" "}
            <span className="text-gray-500 dark:text-[#AFAFAF]">
              Prices Are Buy Orders
            </span>
          </p>
        </div>
      </section>
    </div>
  );
};

export default Description;
