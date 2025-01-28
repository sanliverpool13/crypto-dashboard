import "./App.css";
import OrderBook from "./components/OrderBook";
import Description from "./components/Description";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen flex flex-col gap-8  bg-[#f2f2f2] md:px-40 px-10 py-10">
      <div className="flex justify-center items-center ">
        <div className="flex flex-col lg:w-10/12 lg:flex-row max-w-7xl lg:gap-10 gap-4">
          <Description />
          <OrderBook />
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default App;
