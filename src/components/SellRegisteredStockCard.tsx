import "./styles/sellCard.css";
import { useEffect, useState } from "react";
import { Stock, User } from "./types";
import { SellCard } from "./SellCard";
import { useTranslation } from "react-i18next";

type Props = {
  stock: Stock;
  user: User;
  handleClose: () => void;
};

const SellRegisteredStockCard = ({ stock, user, handleClose }: Props) => {
  const { t, i18n } = useTranslation();
  useEffect(() => {
    if (user) {
      i18n.changeLanguage(user.language);
    }
  }, [user]);

  const [card, setCard] = useState(false);

  function MakeCard(
    price: number,
    qnt: number,
    provents: number,
    sellDate: Date | undefined
  ) {
    stock.price = price;
    stock.provents = provents;
    stock.qnt = qnt;
    if (sellDate) {
      const date = new Date(sellDate.toString());
      const isoString = date.toISOString();
      stock.operationDate = isoString;
    } else {
      stock.operationDate = new Date().toISOString();
    }
    console.log("quantidade a ser vendida: ", stock.qnt);
    setCard(true);
  }

  const [price, setPrice] = useState(0);
  const [qnt, setQnt] = useState(stock.qnt);
  const [provents, setProvents] = useState(0);
  const [sellDate, setSellDate] = useState<Date>();

  return (
    <main>
      {card && stock && (
        <SellCard
          stock={stock}
          user={user}
          qnt={qnt}
          sellPriceSingle={price}
          date={sellDate}
          handleClose={() => {
            setCard(false);
            handleClose();
          }}
        />
      )}
      <div className="screen-blocker-lower">
        <div className="card border">
          <div>
            <label>{t("sell-price") /* Preço a ser vendida */}</label>
            <br />
            <input
              className="default-input"
              type="number"
              onChange={(e) => {
                setPrice(Number(e.target.value));
              }}
            />
          </div>
          <div className="margin-top">
            <label>{t("sell-qnt") /* Quantidade a ser vendida */}</label>
            <br />
            <input
              className="default-input"
              type="number"
              onChange={(e) => {
                setQnt(Number(e.target.value));
              }}
            />
          </div>
          <div className="margin-top">
            <label>{t("sell-earnings") /* Proventos */}</label>
            <br />
            <input
              className="default-input"
              type="number"
              onChange={(e) => {
                setProvents(Number(e.target.value));
              }}
            />
          </div>
          <div className="margin-top">
            <label>{t("sell-date") /* Data da venda  */}</label>
            <br />
            <input
              className="default-input"
              type="date"
              defaultValue={new Date().toISOString().split("T")[0]}
              onChange={(e) => {
                setSellDate(new Date(e.target.value));
              }}
            />
          </div>

          <div className="button-field use-width">
            <button
              className="sim-button green-button use-width button-left-margin"
              onClick={() => {
                console.log(
                  "price: ",price,
                  "qnt: ",qnt,
                  "provents: ",provents,
                  "sellDate: ",sellDate
                );
                MakeCard(price, qnt, provents, sellDate);
              }}
            >
              {t("sell") /*Vender*/}
            </button>
            <button
              className="sim-button use-width button-margin-right"
              onClick={handleClose}
            >
              {t("cancel") /*Cancelar*/}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export { SellRegisteredStockCard };
