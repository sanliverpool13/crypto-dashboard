import "./App.css";
import { useState } from "react";
import OrderBook from "./components/OrderBook";
import Description from "./components/Description";
import Footer from "./components/Footer";
import { useBinanceData } from "./hooks/useBinanceData";
import { Symbol } from "./types/binance";

function App() {
  const [symbol, setSymbol] = useState<Symbol>(Symbol.BTCUSDT);

  const data = useBinanceData(symbol);
  const { lastTraded } = data;

  return (
    <div className="min-h-screen flex flex-col gap-8  bg-[#f2f2f2] md:px-40 px-10 py-10">
      <div className="flex justify-center items-center flex-grow">
        <div className="flex flex-col lg:w-10/12 lg:flex-row max-w-7xl lg:gap-10 gap-4">
          <Description
            lastTraded={lastTraded!}
            setSymbol={setSymbol}
            symbol={symbol}
          />
          <OrderBook data={data} symbol={symbol} />
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default App;
