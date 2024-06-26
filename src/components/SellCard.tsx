import { useMutation, useQueryClient } from "react-query";
import { useStocks } from "../hooks/useStocks";
import { Stock, StockToSell } from "./types";
import { useEffect, useState } from "react";
import { LoadingCard } from "./LoadingCard";
import { api } from "../config/api";
import "./styles/sellCard.css";
import { useTranslation } from "react-i18next";
import { useUser } from "../contexts/userContext";

type Props = {
  stock: Stock;
  qnt: number;
  sellPriceSingle?: number;
  date?: Date;
  handleClose: () => void;
};

const SellCard: React.FC<Props> = ({
  stock,
  qnt,
  sellPriceSingle,
  handleClose,
}) => {
  const { t, i18n } = useTranslation();
  const { user } = useUser();
  useEffect(() => {
    if (user) {
      i18n.changeLanguage(user.language);
    }
  }, [user]);

  // useEffect(() => {
  //   console.log("stock: ", stock);
  // }, []);

  const { useSellStock } = useStocks();

  const [card, setCard] = useState(false);
  const [stockInfo, setStockInfo] = useState<StockToSell>();

  useEffect(() => {
    GotInfo();
  }, [stock]);

  // useEffect(() => {
  //   console.log("stock: ", stock);
  // }, []);

  async function GotInfo() {
    try {
      // console.log(
      //   "id: " +
      //     stock.id +
      //     "\nqnt: " +
      //     qnt +
      //     "\nsellPrice: " +
      //     stock.price +
      //     "\nprovents: " +
      //     stock.provents +
      //     "\ndate: " +
      //     stock.operationDate
      // );
      const response = await api.post("/stocks/sellinfo", {
        id: stock.id,
        qnt: qnt,
        sellPrice: stock.price,
        provents: stock.provents,
        date: stock.operationDate,
      });
      setStockInfo(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  useEffect(() => {
    setCard(true);
    // console.log("stockInfo: ", stockInfo);
  }, [stockInfo]);

  const query = useQueryClient();

  const { isLoading, mutateAsync } = useMutation("fetchStock", useSellStock, {
    onSuccess: () => {
      query.refetchQueries("fetchStocks");
      handleClose();
    },
  });

  async function handleSubmit() {
    console.log(
      "stock: ",
      stock.symbol,
      "\nqnt: ",
      qnt,
      "\nsimulation: ",
      stock.simulation
    );
    await mutateAsync({
      symbol: stock.symbol,
      qnt,
      simulation: stock.simulation,
      id: stock.id,
    });
  }

  return (
    <>
      {isLoading && <LoadingCard />}
      {card && stockInfo && (
        <>
          <div>
            <div className="screen-blocker">
              <form
                className="sell-stock-form black "
                style={{ border: "2px solid #fff" }}
              >
                <div className="title">
                  {t("sell-info-title") /* Informações da venda */}
                </div>

                <div className="orientation-text">
                  {t("stock-name") /* nome da ação */}
                </div>
                <div className="information-text">
                  <span>{stockInfo.stockName}</span>
                  <span>{stockInfo.stockSymbol}</span>
                </div>

                <div className="orientation-text padding-top">
                  {t("sell-value") /* valor de venda */}
                </div>
                <div className="information-text">
                  <span>
                    <span className="orientation-text">R$</span>
                    <span className="money-earned">
                      {stockInfo.sellPrice.toFixed(2)}
                    </span>
                  </span>
                  <span className="orientation-text">{sellPriceSingle}</span>
                </div>

                <div className="orientation-text padding-top">
                  {t("bought-value") /* valor de compra (corrigido) */}
                </div>
                <div className="information-text">
                  <span>
                    <span className="orientation-text">R$</span>
                    <span className="money-spent">
                      {stockInfo.paidPrice.toFixed(2)}
                    </span>
                  </span>
                  <span className="orientation-text">
                    {stockInfo.paidPriceSingle}
                  </span>
                </div>
                <div className="orientation-text padding-top">
                  {t("taxes") /* Impostos */}
                </div>
                <div className="money-spent">
                  <span className="orientation-text">R$</span>{" "}
                  {stockInfo.taxes.toFixed(2)}
                </div>

                <div className="orientation-text padding-top">
                  {t("profit") /* lucro */}
                </div>
                <div>
                  <span className="orientation-text">R$ </span>
                  {stockInfo.profit > 0 ? (
                    <span className="money-earned">
                      {stockInfo.profit.toFixed(2)}
                    </span>
                  ) : (
                    <span className="money-spent">
                      {stockInfo.profit.toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="orientation-text padding-top">
                  {t("profit-percentage") /* Porcentagem de lucro */}
                </div>
                <div className="information-text">
                  {stockInfo.profit > 0 ? (
                    <span className="money-earned">
                      {stockInfo.proportionalProfit}
                    </span>
                  ) : (
                    <span className="money-spent">
                      {stockInfo.proportionalProfit}
                    </span>
                  )}
                </div>

                <div className="next-buttons">
                  <button
                    type="button"
                    className="green-button small-font"
                    onClick={() => handleSubmit()}
                  >
                    {t("sell") /* Vender */}
                  </button>
                  <button
                    type="button"
                    className="red-button small-font"
                    onClick={handleClose}
                  >
                    {t("cancel") /* Cancelar */}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export { SellCard };
