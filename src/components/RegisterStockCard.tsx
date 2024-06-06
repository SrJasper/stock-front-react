import "./styles/registerCard.css";
import { useState } from "react";
import { api } from "../config/api";

type Props = {
  handleClose: () => void;
  stockName?: string;
  stockSymbol?: string;
  stockPrice?: number | undefined;
};

const RegisterStockCard = ({
  handleClose,
  stockName,
  stockSymbol,
  stockPrice,
}: Props) => {
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
  }

  const [newStockName, setNewStockName] = useState(stockName || "");
  const [newStockPrice, setNewStockPrice] = useState<number>(stockPrice || 0);
  const [newStockSymbol, setNewStockSymbol] = useState(stockSymbol || "");
  const [quantity, setQuantity] = useState(0);

  return (
    <div className="screen-blocker">
      <form className="register-stock-form black border">
        <div className="title">Registrar nova ação</div>
        <div className="padding-top">
          <label>Nome da ação</label>
          <input
            className="default-input use-width"
            type="text"
            value={newStockName}
            onChange={(e) => setNewStockName(String(e.target.value))}
          />
        </div>
        <div className="padding-top">
          <div className="input-row">
            <label>Simbolo da ação</label>
            <label className="mark"> ⓘ </label>
          </div>
          <input
            className="default-input use-width"
            type="text"
            value={newStockSymbol}
            onChange={(e) => setNewStockSymbol(String(e.target.value))}
          />
        </div>
        <div className="padding-top">
          <label>Quantidade</label>
          <input
            className="default-input use-width"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>
        <div className="padding-top">
          <label>Preço</label>
          <input
            className="default-input use-width"
            type="number"
            value={newStockPrice}
            onChange={(e) => setNewStockPrice(Number(e.target.value))}
          />
        </div>
        <div className="padding-top">
          <label>Data de compra</label>
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
            registrar
          </button>
          <button
            type="button"
            className="use-width small-font"
            onClick={handleClose}
          >
            cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export { RegisterStockCard };
