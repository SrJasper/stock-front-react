import { useEffect, useState } from "react";
import { LoadingCard } from "./LoadingCard";
import "./styles/sellCard.css";
import { Stock, StockToSell } from "./types";
import { api } from "../config/api";
import { useMutation, useQueryClient } from "react-query";
import { useStocks } from "../hooks/useStocks";

type Props = {
  stock: Stock;
  date?: Date;
  handleClose: () => void;
};

const SellCard: React.FC<Props> = ({ stock, handleClose }) => {
  const { SellStock } = useStocks();

  const [card, setCard] = useState(false);
  const [stockInfo, setStockInfo] = useState<StockToSell>();

  useEffect(() => {
    GotInfo();
  }, [stock]);
  async function GotInfo() {
    try {
      // console.log(
      // 'id: ' + stock.id +
      // '\nsellPrice: ' + stock.price +
      // '\nprovents: ' + stock.provents +
      // '\ndate: ' + stock.operationDate);
      const response = await api.post("/stocks/sell", {
        id: stock.id,
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
  }, [stockInfo]);

  const query = useQueryClient();

  const { isLoading, mutateAsync } = useMutation("sellStock", SellStock, {
    onSuccess: () => {
      query.invalidateQueries("fetchStocks");
      handleClose();
    },
  });

  async function handleSubmit() {
    await mutateAsync(stock.id);
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
                <div className="title">Informações de venda</div>

                <div className="orientation-text">nome da ação</div>
                <div className="information-text">
                  <span>{stockInfo.stockName}</span>
                  <span>{stockInfo.stockSymbol}</span>
                </div>

                <div className="orientation-text padding-top">
                  valor de venda
                </div>
                <div className="information-text">
                  <span>
                    <span className="orientation-text">R$</span>
                    <span className="money-earned">
                      {stockInfo.sellPrice.toFixed(2)}
                    </span>
                  </span>
                  <span className="orientation-text">
                    {stockInfo.sellPriceSingle}
                  </span>
                </div>

                <div className="orientation-text padding-top">
                  valor de compra (corrigido)
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
                <div className="orientation-text padding-top">Impostos</div>
                <div className="money-spent">
                  <span className="orientation-text">R$</span>{" "}
                  {stockInfo.taxes.toFixed(2)}
                </div>

                <div className="orientation-text padding-top">lucro</div>
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
                  Porcentagem de lucro
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
                    onClick={handleSubmit}
                  >
                    Vender
                  </button>
                  <button
                    type="button"
                    className="red-button small-font"
                    onClick={handleClose}
                  >
                    Cancelar
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
