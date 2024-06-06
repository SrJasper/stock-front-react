/* eslint-disable @typescript-eslint/no-explicit-any */
import { RegisterStockCard } from "../../components/RegisterStockCard";
import { StockCardToSim } from "../../components/StockCardToSim";
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

type userInfo = {
  id: string;
  email: string;
  name?: string;
};

function HomePage() {
  const [search, setSearch] = useState("");

  const [stock, setStock] = useState();
  const [noStock, setNoStock] = useState(true);

  const [stockPrice, setStockPrice] = useState<number | undefined>(0);
  const [stockName, setStockName] = useState("");
  const [stockSymbol, setStockSymbol] = useState("");

  const [loading, setLoading] = useState(false);
  const [register, setRegister] = useState(false);

  function registerCard() {
    setRegister(true);
  }

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
        console.log("No stocks found");
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

  async function serachNewStock(e: FormEvent, data: string) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.get("/stocks/search/" + data);
      setStock(res.data);
    } catch (error) {
      alert("Escreva algo para buscar");
    }
    setLoading(false);
  }

  const [user, setUser] = useState<userInfo>();
  async function userInfo() {
    try {
      const response = await api.get("/users/info/");
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    listStocks();
    userInfo();
  }, []);

  function isJsonObject(obj: any) {
    return obj !== null && typeof obj === "object" && !Array.isArray(obj);
  }

  useEffect(() => {
    // console.log(
    //   "Lista de Stocks é vazia? ",
    //   noStock,
    //   "\nTem algum stock sendo procurado? ",
    //   stock
    // );
    // if(noStock && !isJsonObject(stock)){
    //   console.log("Deveria mostrar o NoStockCard");
    // } else {
    //   console.log("Deveria mostrar o StockCardToSim");
    // }
  }, [noStock, stock]);

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
        <h1>Monitor de ações</h1>
        <div className="profile">
          <div className="user-name">Olá, {user?.name}</div>
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
        {loading && <LoadingCard />}
        {register && (
          <RegisterStockCard
            handleClose={() => setRegister(false)}
            stockName={stockName}
            stockSymbol={stockSymbol}
            stockPrice={stockPrice}
          />
        )}
        <div className="search-tab">
          <div className="search-field">
            <label>Procurar ação</label>
            <div className="search-ballon">
              <input
                className="use-width"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    serachNewStock(e, search);
                  }
                }}
              />
              <button
                className=" search-button"
                onClick={(e) => serachNewStock(e, search)}
              >
                pesquisar
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
            Registrar ação
          </button>
        </div>

        <div className="link-stocks">
          <a
            href="https://www.b3.com.br/pt_br/market-data-e-indices/indices/indices-amplos/indice-ibovespa-ibovespa-composicao-da-carteira.htm"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ver lista de ações (ibovespa)
          </a>
        </div>

        {!noStock && (
          <div className="search-symbol">
            <select value={selectedSymbol} onChange={handleSymbolChange}>
              <option value="opcao1">Selecionar ação</option>
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

        {(!noStock || isJsonObject(stock)) && (
          <hr className="separation-line" />
        )}

        <ol className="stock-board">
          {stock && (
            <StockCardToSim
              stock={stock}
              handleOpenRegisterCard={(name, symbol, price) => {
                setRegister(true);
                setStockName(name);
                setStockSymbol(symbol);
                setStockPrice(price);
              }}
              handleReturn={() => {
                setStock(undefined);
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
          {noStock && !stock && <NoStockCard />}
        </ol>
      </div>
    </main>
  );
}

export default HomePage;
