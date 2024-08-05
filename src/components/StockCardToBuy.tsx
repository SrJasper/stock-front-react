import { useMutation, useQueryClient } from "react-query";
import { useStocks } from "../hooks/useStocks";
import { StockToBuy } from "./types";
import { LoadingCard } from "./LoadingCard";
import "./styles/cardConfiguration.css";
import "./styles/buyStockCard.css";
import { useEffect, useState } from "react";
import "./styles/stockCard.css";
import { useTranslation } from "react-i18next";
import { useUser } from "../contexts/userContext";

type Props = {
  stock: StockToBuy;
  handleClose?: () => void;
  handleOpenRegisterCard?: (
    name: string,
    symbol: string,
    price: number
  ) => void;
  handleReturn?: () => void;
};

const Card = ({ stock, handleClose }: Props) => {
  const { t, i18n } = useTranslation();
  useEffect(() => {
    i18n.changeLanguage("en");
  }, [i18n]);

  const [qnt, setQnt] = useState(0);
  const { useNewSimStock } = useStocks();

  const query = useQueryClient();
  const { isLoading, mutateAsync } = useMutation("simStock", useNewSimStock, {
    onSuccess: () => {
      query.refetchQueries("fetchStocks");
      query.invalidateQueries("stockToBuy");
      // console.log("Stock bought");
      handleClose && handleClose();
    },
  });

  async function handleSubmit() {
    stock.qnt = qnt;
    await mutateAsync(stock);
    query.setQueryData("stockToBuy", undefined);
  }

  return (
    <main>
      {isLoading && <LoadingCard />}
      <div className="screen-blocker">
        <div className="card border">
          <label>{t("qnt-buy") /* Quantidade à ser comprada */}</label>
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
              onClick={handleSubmit}
            >
              {t("buy") /* Comprar */}
            </button>
            <button className="use-width sim-button" onClick={handleClose}>
              {t("cancel") /*Cancelar*/}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

const StockCardToBuy = ({
  stock,
  handleOpenRegisterCard,
  handleReturn,
}: Props) => {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      i18n.changeLanguage(user.language);
    }
  }, [user]);
  const { t, i18n } = useTranslation();

  const [card, setCard] = useState(false);
  let stockSymbol: string;
  if (stock.Symbol) {
    stockSymbol = stock.Symbol.toUpperCase();
  } else {
    return (
      <>
        <div className="no-stock-card">
          <h2>{t("symbol-not-found-title") /* Símbolo não encontrado */}</h2>
          <p>
            {
              t("symbol-not-found-text") /* 
            Você pode olhar no link 
            para ver uma lista com símbolos
            de ações disponíveis ou tentar
            novamente com outro símbolo. 
            */
            }
          </p>
          <button className="register-stock-button" onClick={handleReturn}>
            {t("back") /* voltar */}
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
      <li className="stock-to-buy ol-blocker">
        <div className="stock-to-buy-info">
          <div>
            <label className="use-width"> {stock.LongName} </label>
            <h2 className="big-font use-width">
              {" "}
              {stock.Symbol.toUpperCase()}{" "}
            </h2>
          </div>
          <div>
            <label className="use-height ">{t("value") /* valor */}</label>
            <label className="big-font">
              {" "}
              {stock.Price ? stock.Price : 0}{" "}
            </label>
          </div>
        </div>

        <div className="new-stock-buttons mobile-maring-down">
          <div className="use-height use-width buy-button-height">
            <button
              className="buy-button buy-button-height margin-right green-button use-width"
              onClick={() => setCard(true)}
            >
              {t("buy") /* Comprar */}
            </button>
          </div>
          <div className="alternative-buttons">
            <button
              className="register-stock-button"
              onClick={() => {
                handleOpenRegisterCard &&
                  handleOpenRegisterCard(stockName, stockSymbol, stock.Price);
              }}
            >
              {t("register") /* Registrar */}
            </button>
            <button
              className="register-stock-button margin-down"
              onClick={handleReturn}
            >
              {t("cancel") /* Cancelar */}
            </button>
          </div>
        </div>
      </li>
      <hr className="separation-line" />
    </>
  );
};

export { StockCardToBuy };
