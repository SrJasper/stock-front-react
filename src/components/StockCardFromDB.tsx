import { useState, useEffect } from "react";
import { SellCard } from "./SellCard";
import { LoadingCard } from "./LoadingCard";
import { SellRegisteredStockCard } from "./SellRegisteredStockCard";
import { Stock } from "./types";
import { api } from "../config/api";
import { useQuery, useQueryClient } from "react-query";
import { useTranslation } from "react-i18next";
import { StatementCard } from "./StatementCard";
import { useUser } from "../contexts/userContext";

type Props = {
  filterSymbol?: string;
};

const StockCardFromDB: React.FC<{ filterSymbol?: string }> = ({
  filterSymbol,
}: Props) => {
  const { user } = useUser();

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

  const listStocks = async (): Promise<Stock[]> => {
    try {
      const response = await api.get("/stocks/listall");

      if (response.data.length !== 0) {
        const symbolsToFindPrice = response.data
          .filter((stock: Stock) => stock.qnt !== 0)
          .map((stock: Stock) => stock.symbol);
        setStockToFindPrice(symbolsToFindPrice);
        return response.data;
      } else {
        return response.data;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };
  
  const { data: dataQuery, isLoading } = useQuery("fetchStocks", listStocks);

  const [stockData, setStockData] = useState<Stock[]>();

  useEffect(() => {
    GetPriceFromAPI(stockToFindPrice);
    if(dataQuery){
      setStockData(dataQuery);
    }
  }, [dataQuery, stockToFindPrice]);

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

  const toggleStatement = (index: number) => {
    setStatement((prevState) => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };

  return (
    <>
      {isLoading && <LoadingCard />}
      {card && stockToPass && (
        <SellCard
          stock={stockToPass}
          qnt={stockToPass.qnt}
          handleClose={() => setCard(false)}
        />
      )}
      {cardReg && stockToPass && (
        <SellRegisteredStockCard
          stock={stockToPass}
          handleClose={() => setCardReg(false)}
        />
      )}
      {stockData && stockData.length > 0 ? (
        stockData
          .filter(
            (stock) => !filterSymbol || stock.symbol.includes(filterSymbol)
          )
          .filter(
            (stock) => stock.type === "media" || stock.simulation === true
          )
          .map((stockOl, index) => (
            <li className="stock" key={stockOl.id}>
              <div className="stock-div use-width">
                <div className="stock-name">
                  <label className="small-font margin-top use-width">
                    {stockOl.longName}
                  </label>
                  <p
                    className={`
                    big-font 
                    margin-down 
                    use-width 
                    ${!stockOl.simulation ? "golden" : ""}`}
                  >
                    {stockOl.symbol}
                  </p>
                </div>
                <div className="stock-info-display use-width">
                  <div
                    className={`stock-comparison ${
                      stockOl.qnt === 0 ? "disable" : ""
                    }`}
                  >
                    <div className="stock-info">
                      <label className="stock-label small-font">
                        {t("bought") /* rendimento */}
                      </label>
                      <div className="stock-value big-font">
                        <p
                          className={`big-font  ${
                            (Number(stockPriceFromApi[index]) - stockOl.price) /
                              Number(stockPriceFromApi[index]) >
                            0
                              ? "green-font"
                              : "red-font"
                          }`}
                        >
                          {stockOl.price
                            ? (
                                (Number(stockPriceFromApi[index]) -
                                  stockOl.price) /
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
                        Number(stockPriceFromApi[index]) > stockOl.price
                          ? "green-button"
                          : "red-button"
                      }`}
                      onClick={() =>
                        stockOl.qnt > 0
                          ? SellStockModal(stockOl)
                          : DellStock(stockOl.symbol, stockOl.simulation)
                      }
                    >
                      <label>
                        {stockOl.qnt > 0 ? t("sell") : t("dell") /* Vender */}
                      </label>
                      <label className="qnt-text">({stockOl.qnt})</label>
                    </button>
                    <div
                      className={`use-width display-column
                      ${stockOl.simulation === true ? "disable" : ""}
                    `}
                    >
                      <button
                        onClick={() => {
                          toggleStatement(index);
                          // setStock(stockOl);
                        }}
                        className="buy-button use-width"
                      >
                        <label> {t("account-statement") /* extrato */} </label>
                      </button>
                      {statement[index] && stockOl.symbol && <StatementCard />}
                    </div>
                  </div>
                </div>
              </div>
              <hr className="separation-line margin-top" />
            </li>
          ))
      ) : (
        <></>
      )}
    </>
  );
};

export default StockCardFromDB;
