import { RegisterStockCard } from "../../components/RegisterStockCard";
import { StockCardToBuy } from "../../components/StockCardToBuy";
import StockCardFromDB from "../../components/StockCardFromDB";
import { LoadingCard } from "../../components/LoadingCard";
import { NoStockCard } from "../../components/NoStockCard";
import { FormEvent, useEffect, useState } from "react";
import Gear from "../../../public/images/gear.png";
import Exit from "../../../public/images/exit.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store/useAuth";
import "./HomeStyle.css";
import { api } from "../../config/api";
import { StockToBuy } from "../../components/types";
import { useQuery, useQueryClient } from "react-query";
import { useTranslation } from "react-i18next";

function HomePage() {
  async function getUserInfo() {
    const response = await api.get("/users/info/");
    return response.data;
  }

  const { data: user, isLoading } = useQuery("fetchUser", getUserInfo);
  useEffect(() => {
    if (user) {
      i18n.changeLanguage(user.language);
    }
  }, [user]);
  const { t, i18n } = useTranslation();

  const [search, setSearch] = useState("");
  const [noStock, setNoStock] = useState(true);
  const [stockPrice, setStockPrice] = useState<number | undefined>(0);
  const [stockName, setStockName] = useState("");
  const [stockSymbol, setStockSymbol] = useState("");
  // const [loading, setLoading] = useState(false);
  const [register, setRegister] = useState(false);

  function registerCard() {
    setRegister(true);
  }

  useEffect(() => {
    listStocks();
    getUserInfo();
  }, []);

  const navigate = useNavigate();
  const { logout } = useAuth();

  function handleLogout() {
    navigate("/");
    logout();
  }

  const [stockList, setStockList] = useState([]);
  async function listStocks() {
    try {
      const response = await api.get("/stocks/listall");
      if (response.data.length === 0) {
        setNoStock(true);
      } else {
        setNoStock(false);
        setStockList(
          response.data.map((item: { symbol: string }) => item.symbol)
        );
      }
    } catch (error) {
      setNoStock(true);
    }
  }

  const queryClient = useQueryClient();
  const { data: stockToBuy, refetch } = useQuery<StockToBuy | undefined>(
    "stockToBuy",
    () => queryClient.getQueryData<StockToBuy>("stockToBuy"),
    { enabled: false }
  );

  async function searchNewStock(e: FormEvent, data: string) {
    e.preventDefault();
    // setLoading(true);
    try {
      const res = await api.get("/stocks/search/" + data);
      queryClient.setQueryData("stockToBuy", res.data);
      refetch();
    } catch (error) {
      alert("Escreva algo para pesquisar!");
    }
    // setLoading(false);
  }

  function isJsonObject(obj: any) {
    return obj !== null && typeof obj === "object" && !Array.isArray(obj);
  }

  const [selectedSymbol, setSelectedSymbol] = useState<string>("opcao1");

  const handleSymbolChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSymbol(event.target.value);
  };

  function updateAccount() {
    navigate("/update");
  }

  return (
    <main>
      <div className="header-container">
        <h1>{t("site-title") /*Monitor de ações*/}</h1>
        <div className="profile">
          <div className="user-name">
            {t("hello") /*Olá*/}, {user?.name}
          </div>
          <div>
            <img
              className="option-icon gear-icon"
              onClick={updateAccount}
              src={Gear}
              alt=""
            />
            <img
              className="option-icon exit-icon"
              onClick={handleLogout}
              src={Exit}
              alt=""
            />
          </div>
        </div>
      </div>

      <div className="market-body">
        {isLoading && <LoadingCard user={user} />}
        {register && (
          <RegisterStockCard
            handleClose={() => setRegister(false)}
            user={user}
            stockName={stockName}
            stockSymbol={stockSymbol}
            stockPrice={stockPrice}
          />
        )}
        <div className="search-tab">
          <div className="search-field">
            <label>{t("search-stock") /* Procurar ação */}</label>
            <div className="search-ballon">
              <input
                className="use-width"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    searchNewStock(e, search);
                  }
                }}
              />
              <button
                className="search-button"
                onClick={(e) => searchNewStock(e, search)}
              >
                {t("search") /* pesquisar */}
              </button>
            </div>
          </div>

          <button
            className="reg-button"
            onClick={() => {
              registerCard();
              setStockName("");
              setStockSymbol("");
              setStockPrice(undefined);
            }}
          >
            {t("register-stock") /* Registrar ação */}
          </button>
        </div>

        <div className="link-stocks">
          <a
            href="https://www.b3.com.br/pt_br/market-data-e-indices/indices/indices-amplos/indice-ibovespa-ibovespa-composicao-da-carteira.htm"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("stock-list") /* Ver lista de ações (ibovespa) */}
          </a>
        </div>

        {!noStock && (
          <div className="search-symbol">
            <select value={selectedSymbol} onChange={handleSymbolChange}>
              <option value="opcao1">
                {t("stock-select") /* Selecionar ação */}
              </option>
              {stockList
                .filter((value, index, self) => self.indexOf(value) === index)
                .map((stock, index) => (
                  <option key={index} value={stock}>
                    {stock}
                  </option>
                ))}
            </select>
          </div>
        )}

        {(!noStock || isJsonObject(stockToBuy)) && (
          <hr className="separation-line" />
        )}

        <ol className="stock-board">
          {stockToBuy && (
            <StockCardToBuy
              stock={stockToBuy}
              user={user}
              handleOpenRegisterCard={(name, symbol, price) => {
                setRegister(true);
                setStockName(name);
                setStockSymbol(symbol);
                setStockPrice(price);
              }}
              handleReturn={() => {
                queryClient.setQueryData("stockToBuy", undefined);
              }}
            />
          )}
          {!noStock && (
            <StockCardFromDB
              filterSymbol={
                selectedSymbol !== "opcao1" ? selectedSymbol : undefined
              }
              user={user}
            />
          )}
          {noStock && !stockToBuy && <NoStockCard user={user} />}
        </ol>
      </div>
    </main>
  );
}

export default HomePage;
