import { LoadingCard } from "./LoadingCard";
import "./styles/cardConfiguration.css";
import { useState } from "react";
import "./styles/stockCard.css";
import "./styles/buyStockCard.css";
import { api } from "../config/api";

export type StockToRequestSim = {
  Symbol: string;
  LongName: string;
  Price: number;
};

type Props = {
  stock: StockToRequestSim;
  handleClose?: () => void;
  handleOpenRegisterCard?: (
    name: string,
    symbol: string,
    price: number
  ) => void;
  handleReturn?: () => void;
};

const Card = ({ stock, handleClose }: Props) => {
  const [qnt, setQnt] = useState(0);
  const [loading, setLoading] = useState(false);

  const refreshPage = () => {
    window.location.reload();
  };

  async function simStock() {
    const symbol = stock.Symbol.toUpperCase();

    const data = {
      symbol: symbol,
      price: stock.Price,
      longName: stock.LongName,
      qnt: qnt,
    };
    setLoading(true);
    await api.post("/stocks/newsim", data);
    refreshPage();
  }

  return (
    <main>
      {loading && <LoadingCard />}
      <div className="screen-blocker">
        <div className="card border">
          <label> Quantidade à ser comprada </label>
          <br />
          <input
            className="default-input margin-top"
            type="number"
            value={qnt}
            onChange={(e) => setQnt(parseFloat(e.target.value))}
          />
          <div className="button-field">
            <button
              className="use-width sim-button green-button"
              onClick={simStock}
            >
              {" "}
              Comprar{" "}
            </button>
            <button className="use-width sim-button" onClick={handleClose}>
              {" "}
              Cancelar{" "}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

const StockCardToSim = ({
  stock,
  handleOpenRegisterCard,
  handleReturn,
}: Props) => {
  const [card, setCard] = useState(false);
  let stockSymbol: string;
  if (stock.Symbol) {
    stockSymbol = stock.Symbol.toUpperCase();
  } else {
    return (
      <>
        <div className="no-stock-card">
          <h2>Símbolo não encontrado</h2>
          <p>
            Você pode olhar no link para ver uma lista com símbolos de ações
            disponíveis ou tentar novamente com outro símbolo.
          </p>
          <button className="register-stock-button" onClick={handleReturn}>
            {" "}
            voltar{" "}
          </button>
        </div>
      </>
    );
  }
  const stockName = stock.LongName;

  return (
    <>
      {card && (
        <Card
          stock={stock}
          handleOpenRegisterCard={() => setCard(true)}
          handleClose={() => setCard(false)}
        />
      )}
      <li className="stock ol-blocker">
        <div className="stock-blocks use-width">
          <div className="use-width margin-top margin-down-pc">
            <label> {stock.LongName} </label>
            <label className="big-font"> {stock.Symbol.toUpperCase()} </label>
          </div>
          <div className="use-width text-centralize margin-top margin-down-pc">
            <label className="use-height "> valor </label>
            <label className="big-font"> {stock.Price ? stock.Price : 0} </label>
          </div>
        </div>

        <div className="new-stock-buttons margin-line-bottom">
          <button
            className="buy-button margin-right green-button use-width"
            onClick={() => setCard(true)}
          >
            Comprar
          </button>
          <div className="alternative-buttons">
            <button
              className="register-stock-button"
              onClick={() => {
                handleOpenRegisterCard &&
                  handleOpenRegisterCard(stockName, stockSymbol, stock.Price);
              }}
            >
              {" "}
              Registrar{" "}
            </button>
            <button className="register-stock-button margin-down" onClick={handleReturn}>
              {" "}
              Cancelar{" "}
            </button>
          </div>
        </div>
      </li>
      <hr className="separation-line" />
    </>
  );
};

export { StockCardToSim };
