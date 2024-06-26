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
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useTranslation } from "react-i18next";
import { useStocks } from "../../hooks/useStocks";
import { useUser } from "../../contexts/userContext";
// import { useStock } from "../../contexts/stockContext";

function HomePage() {
  const { useSearchNewStock } = useStocks();

  async function getUserInfo() {
    const response = await api.get("/users/info/");
    return response.data;
  }
  const { data: user, isLoading } = useQuery("fetchUser", getUserInfo);

  const { setUser } = useUser();
  // const { stock } = useStock();

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);

  useEffect(() => {
    if (user) {
      i18n.changeLanguage(user.language);
    }
  }, [user]);
  const { t, i18n } = useTranslation();

  const [search, setSearch] = useState("");
  const [stockPrice, setStockPrice] = useState<number | undefined>(0);
  const [stockName, setStockName] = useState("");
  const [stockSymbol, setStockSymbol] = useState("");
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

  const [noStock, setNoStock] = useState(true);
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

  const query = useQueryClient();
  const { data: stockToBuy, refetch } = useQuery<StockToBuy | undefined>(
    "stockToBuy",
    () => query.getQueryData<StockToBuy>("stockToBuy"),
    { enabled: false }
  );

  const { mutateAsync: searchStock } = useMutation(useSearchNewStock, {
    onSuccess: (data) => {
      query.setQueryData("stockToBuy", data);
      refetch();
    },
    onError: (error) => {
      console.error("Erro ao buscar a ação:", error);
    },
  });

  async function handleSubmit(e: FormEvent, qnt: string) {
    await searchStock({ e, data: qnt });
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
        {isLoading && <LoadingCard />}
        {register && (
          <RegisterStockCard
            handleClose={() => setRegister(false)}
            //
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
                    handleSubmit(e, search);
                  }
                }}
              />
              <button
                className="search-button"
                onClick={(e) => {
                  handleSubmit(e, search);
                }}
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
              handleOpenRegisterCard={(name, symbol, price) => {
                setRegister(true);
                setStockName(name);
                setStockSymbol(symbol);
                setStockPrice(price);
              }}
              handleReturn={() => {
                query.setQueryData("stockToBuy", undefined);
              }}
            />
          )}
          {!noStock && (
            <StockCardFromDB
              filterSymbol={
                selectedSymbol !== "opcao1" ? selectedSymbol : undefined
              }
            />
          )}
          {noStock && !stockToBuy && <NoStockCard />}
        </ol>
      </div>
    </main>
  );
}

export default HomePage;
