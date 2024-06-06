import { useState, useEffect } from "react";
import { SellCard } from "./SellCard";
import { LoadingCard } from "./LoadingCard";
import { SellRegisteredStockCard } from "./SellRegisteredStockCard";
import { Stock } from "./types";
import { api } from "../config/api";
import { useQuery } from "react-query";

const StockCardFromDB: React.FC<{ filterSymbol?: string }> = ({
  filterSymbol,
}) => {
  const [card, setCard] = useState(false);
  const [cardReg, setCardReg] = useState(false);
  const [stockToPass, setStockToPass] = useState<Stock>();
  const [stockToFindPrice, setStockToFindPrice] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [stockPriceFromApi, setStockPriceFromApi] = useState<string[]>([]);

  const listStocks = async (): Promise<Stock[]> => {
    try {
      const response = await api.get("/stocks/listall");
      setStockToFindPrice(response.data.map((stock: Stock) => stock.symbol));
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  const { data, isLoading } = useQuery("fetchStocks", listStocks);

  useEffect(() => {
    StockPriceFromAPI(stockToFindPrice);
  }, [data]);

  const StockPriceFromAPI = async (data: string[]) => {
    const prices = [];
    for (const stockToBePriced of data) {
      const res = await api.get(`/stocks/search/${stockToBePriced}`);
      prices.push(res.data.Price);
    }
    setStockPriceFromApi(prices);
    setLoaded(true);
  };

  useEffect(() => {
    listStocks();
  }, []);

  useEffect(() => {
    if (stockToFindPrice.length > 0 && !loaded) {
      StockPriceFromAPI(stockToFindPrice);
    }
  }, [stockToFindPrice, loaded]);

  async function SellStockModal(stock: Stock) {
    setStockToPass(stock);
    if (stock.simulation) {
      setCard(true);
    } else {
      setCardReg(true);
    }
  }

  return (
    <>
      {isLoading && <LoadingCard />}
      {card && stockToPass && (
        <SellCard stock={stockToPass} handleClose={() => setCard(false)} />
      )}
      {cardReg && data?.find((s) => !s.simulation) && (
        <SellRegisteredStockCard
          stock={data?.find((s) => !s.simulation)!}
          handleClose={() => setCardReg(false)}
        />
      )}
      {data && data.length > 0 ? (
        data
          .filter(
            (stock) => !filterSymbol || stock.symbol.includes(filterSymbol)
          )
          .map((stock, index) => (
            <>
              <li className="stock" key={stock.id}>
                <div className="stock-name">
                  <label className="small-font margin-top">
                    {" "}
                    {stock.longName}
                  </label>
                  <p className="big-font margin-down">{stock.symbol}</p>
                </div>

                <div className="stock-comparison">
                  <div className="stock-info">
                    <label className="stock-label small-font">compra</label>
                    <div className="stock-value big-font">
                      <p className="big-font red-font">
                        {" "}
                        {stock.price ? stock.price : 0}
                      </p>
                    </div>
                  </div>
                  <div className="stock-info value-to-sell">
                    <label className="stock-label small-font">
                      valor atual
                    </label>
                    <div className="stock-value big-font">
                      <p className="big-font green-font">
                        {stockPriceFromApi[index]
                          ? Number(stockPriceFromApi[index])
                          : "--"}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    className={`margin-down buy-button ${
                      Number(stockPriceFromApi[index]) > stock.price
                        ? "green-button"
                        : "red-button"
                    }`}
                    onClick={() => SellStockModal(stock)}
                  >
                    Vender
                  </button>
                </div>
              </li>
              <hr className="separation-line" />
            </>
          ))
      ) : (
        <></>
      )}
    </>
  );
};

export default StockCardFromDB;
