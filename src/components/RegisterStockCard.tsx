import "./styles/registerCard.css";
import { useEffect, useState } from "react";
import { api } from "../config/api";
import { useTranslation } from "react-i18next";
import { User } from "./types";
import { useQueryClient } from "react-query";

type Props = {
  handleClose: () => void;
  user: User;
  stockName?: string;
  stockSymbol?: string;
  stockPrice?: number | undefined;
};

const RegisterStockCard = ({
  handleClose,
  user,
  stockName,
  stockSymbol,
  stockPrice,
}: Props) => {

  
  const { t, i18n } = useTranslation();
  useEffect(() => {
    if(user){
      console.log(user);
      i18n.changeLanguage(user.language);
    }
  }, [user]);

  const query = useQueryClient();

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  async function registerStock() {
    const data = {
      symbol: newStockSymbol,
      longName: newStockName,
      price: newStockPrice,
      qnt: quantity,
      operationDate: date,
    };
    await api.post("/stocks/regsim", data);
    query.refetchQueries("fetchStocks");
  }

  const [newStockName, setNewStockName] = useState(stockName || "");
  const [newStockPrice, setNewStockPrice] = useState<number>(stockPrice || 0);
  const [newStockSymbol, setNewStockSymbol] = useState(stockSymbol || "");
  const [quantity, setQuantity] = useState(0);

  return (
    <div className="screen-blocker">
      <form className="register-stock-form black border">
        <div className="title">
          {t("register-stock-title")/* Registrar nova ação */}
        </div>
        <div className="padding-top">
          <label>
            {t("stock-name")/* Nome da ação */}
          </label>
          <input
            className="default-input use-width"
            type="text"
            value={newStockName}
            onChange={(e) => setNewStockName(String(e.target.value))}
          />
        </div>
        <div className="padding-top">
          <div className="input-row">
            <label>
              {t("stock-symbol")/* Simbolo da ação */}
            </label>
            {/* <label className="mark"> ⓘ </label> */}
          </div>
          <input
            className="default-input use-width"
            type="text"
            value={newStockSymbol}
            onChange={(e) => setNewStockSymbol(String(e.target.value))}
          />
        </div>
        <div className="padding-top">
          <label>
            {t("qnt")/* Quantidade */}
          </label>
          <input
            className="default-input use-width"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>
        <div className="padding-top">
          <label>
            {t("price")/* Preço */}
          </label>
          <input
            className="default-input use-width"
            type="number"
            value={newStockPrice}
            onChange={(e) => setNewStockPrice(Number(e.target.value))}
          />
        </div>
        <div className="padding-top">
          <label>
            {t("bought-date")/* Data de compra */}
          </label>
          <input
            className="default-input use-width"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="use-width next-buttons padding-top">
          <button
            type="button"
            className="use-width small-font green-button"
            onClick={() => {
              registerStock();
              handleClose();
            }}
          >
            {t("register")/* registrar */}
          </button>
          <button
            type="button"
            className="use-width small-font"
            onClick={handleClose}
          >
            {t("cancel")/* cancelar */}
          </button>
        </div>
      </form>
    </div>
  );
};

export { RegisterStockCard };
