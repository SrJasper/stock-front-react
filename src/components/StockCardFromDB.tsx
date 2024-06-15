import { useState, useEffect } from "react";
import { SellCard } from "./SellCard";
import { LoadingCard } from "./LoadingCard";
import { SellRegisteredStockCard } from "./SellRegisteredStockCard";
import { Stock, User } from "./types";
import { api } from "../config/api";
import { useQuery } from "react-query";
import { useTranslation } from "react-i18next";

type Props = {
  filterSymbol?: string;
  user: User;
};

const StockCardFromDB: React.FC<{ filterSymbol?: string; user: User }> = ({
  filterSymbol,
  user,
}: Props) => {
  const { t, i18n } = useTranslation();
  useEffect(() => {
    if (user) {
      i18n.changeLanguage(user.language);
    }
  }, [user]);

  const [card, setCard] = useState(false);
  const [cardReg, setCardReg] = useState(false);
  const [stockToPass, setStockToPass] = useState<Stock>();
  const [stockToFindPrice, setStockToFindPrice] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [stockPriceFromApi, setStockPriceFromApi] = useState<string[]>([]);

  useEffect(() => {
    listStocks();
  }, []);

  const listStocks = async (): Promise<Stock[]> => {
    try {
      const response = await api.get("/stocks/listall");
      if (response.data.length !== 0) {
        setStockToFindPrice(response.data.map((stock: Stock) => stock.symbol));
        return response.data;
      } else {
        return response.data;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  const { data, isLoading } = useQuery("fetchStocks", listStocks);

  useEffect(() => {
    GetPriceFromAPI(stockToFindPrice);    
  }, [data, stockToFindPrice]);

  const GetPriceFromAPI = async (data: string[]) => {
    const prices = [];
    for (const stockToBePriced of data) {
      const res = await api.get(`/stocks/search/${stockToBePriced.toLowerCase()}`);
      if(res.data.Price === undefined){
        const res2 = await api.get(`/stocks/search/${stockToBePriced.toUpperCase()}`);
        prices.push(res2.data.Price);
      } else {
        prices.push(res.data.Price);
      }
    }
    setStockPriceFromApi(prices);
    setLoaded(true);
  };

  useEffect(() => {
    if (stockToFindPrice.length > 0 && !loaded) {
      GetPriceFromAPI(stockToFindPrice);
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
      {isLoading && <LoadingCard user={user} />}
      {card && stockToPass && (
        <SellCard
          stock={stockToPass}
          user={user}
          qnt={stockToPass.qnt}
          handleClose={() => setCard(false)}
        />
      )}
      {cardReg && stockToPass && (
        <SellRegisteredStockCard
          stock={stockToPass}
          user={user}
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
                  <label className="small-font margin-top use-width">
                    {stock.longName}
                  </label>
                  <p
                    className={`
                    big-font 
                    margin-down 
                    use-width 
                    ${!stock.simulation ? "registered-stock" : ""}`}
                  >
                    {stock.symbol}
                  </p>
                </div>

                <div className="stock-info-display">
                  <div className="stock-comparison">
                    <div className="stock-info">
                      <label className="stock-label small-font">
                        {t("bought") /* compra */}
                      </label>
                      <div className="stock-value big-font">
                        <p className="big-font red-font">
                          {stock.price ? stock.price : 0}
                        </p>
                      </div>
                    </div>
                    <div className="stock-info value-to-sell">
                      <label className="stock-label small-font">
                        {t("current-value") /* valor atual */}
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
                      className={`buy-button margin-down ${
                        Number(stockPriceFromApi[index]) > stock.price
                          ? "green-button"
                          : "red-button"
                      }`}
                      onClick={() => SellStockModal(stock)}
                    >
                      <p>
                      {t("sell") /* Vender */}  
                      </p>
                      <p className="qnt-text">
                        ({stock.qnt})
                      </p>
                    </button>
                  </div>
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
