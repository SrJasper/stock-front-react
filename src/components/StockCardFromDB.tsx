import { useState, useEffect } from "react";
import { SellCard } from "./SellCard";
import { LoadingCard } from "./LoadingCard";
import { SellRegisteredStockCard } from "./SellRegisteredStockCard";
import { Stock, User } from "./types";
import { api } from "../config/api";
import { useQuery, useQueryClient } from "react-query";
import { useTranslation } from "react-i18next";
import { StatementCard } from "./StatementCard";

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
      const res = await api.get(
        `/stocks/search/${stockToBePriced.toLowerCase()}`
      );
      if (res.data.Price === undefined) {
        const res2 = await api.get(
          `/stocks/search/${stockToBePriced.toUpperCase()}`
        );
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

  const query = useQueryClient();

  async function DellStock(symbol: string, simulation: boolean) {
    await api.delete("/stocks/del/", {
      data: { symbol: symbol, simulation: simulation },
    });
    query.refetchQueries("fetchStocks");
  }

  const [statement, setStatement] = useState<boolean[]>([]);

  useEffect(() => {
    if (data) setStatement(new Array(data.length).fill(false));
  }, [data]);

  const toggleStatement = (index: number) => {
    setStatement((prevState) => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };

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
          .filter(
            (stock) => stock.type === "media" || stock.simulation === true
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
                    ${!stock.simulation ? "golden-font" : ""}`}
                  >
                    {stock.symbol}
                  </p>
                </div>

                <div className="stock-info-display use-width">
                  <div className="stock-comparison">
                    <div className="stock-info">
                      <label className="stock-label small-font">
                        {t("bought") /* rendimento */}
                      </label>
                      <div className="stock-value big-font">
                        <p
                          className={`big-font  ${
                            (Number(stockPriceFromApi[index]) - stock.price) /
                              Number(stockPriceFromApi[index]) >
                            0
                              ? "green-font"
                              : "red-font"
                          }`}
                        >
                          {stock.price
                            ? (
                                (Number(stockPriceFromApi[index]) -
                                  stock.price) /
                                Number(stockPriceFromApi[index])
                              ).toFixed(2) + "%"
                            : 0}
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

                  <div className="stock-options-menu use-width">
                    <button
                      className={`buy-button spacer use-width ${
                        Number(stockPriceFromApi[index]) > stock.price
                          ? "green-button"
                          : "red-button"
                      }`}
                      onClick={() =>
                        stock.qnt > 0
                          ? SellStockModal(stock)
                          : DellStock(stock.symbol, stock.simulation)
                      }
                    >
                      <label>
                        {stock.qnt > 0 ? t("sell") : t("dell") /* Vender */}
                      </label>
                      <label className="qnt-text">({stock.qnt})</label>
                    </button>
                    <div
                      className={`use-width display-column
                      ${stock.simulation === true ? "disable" : ""}
                    `}
                    >
                      <button
                        onClick={() => {
                          toggleStatement(index);
                        }}
                        className="buy-button use-width"
                      >
                        <label> {t("account-statement") /* extrato */} </label>
                      </button>
                      {statement[index] && stock.symbol && (
                        <StatementCard symbol={stock.symbol} />
                      )}
                    </div>
                  </div>
                </div>
              </li>
              <hr className="separation-line margin-top" />
            </>
          ))
      ) : (
        <></>
      )}
    </>
  );
};

export default StockCardFromDB;
