/* eslint-disable @typescript-eslint/no-explicit-any */
import { RegisterStockCardMobile } from "../../componentsMobile/RegisterStockCardMobile";
import { StockCardToSim } from "../../componentsMobile/StockCardToSimMobile";
import StockCardFromDB from "../../componentsMobile/StockCardFromDBMobile";
import { LoadingCard } from "../../componentsMobile/LoadingCardMobile";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../store/useAuth.ts';
import Cookies from "js-cookie";
import axios from "axios";
import './HomeStyleMobile.css';
import { NoStockCardMobile } from "../../componentsMobile/NoStockCardMobile.tsx";

type userInfo = {
  id: string;
  email: string;
  name?: string;
}

function HomePage() {

  const [search, setSearch] = useState("");

  const [stock, setStock] = useState();
  const [noStock, setNoStock] = useState(true);

  const [stockPrice, setStockPrice] = useState<number | undefined>(0);
  const [stockName, setStockName] = useState("");
  const [stockSymbol, setStockSymbol] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [register, setRegister] = useState(false);

  const token = Cookies.get("refreshToken");

  const navigate = useNavigate();

  const {logout} = useAuth()

  function handleLogout() {
    navigate("/")
    logout()
  }

  async function searchNewStock(e:FormEvent ,data: string) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.get("https://stock-project-seven.vercel.app/stocks/search/" + data, {headers: {Authorization: `Bearer ${token}`}})
      setStock(res.data);
    } catch (error) {      
      alert("Escreva algo para buscar");
    }
    setLoading(false);
  }

  const [user, setUser] = useState<userInfo>();
  async function userInfo() {
    try {
      const response = await axios.get("https://stock-project-seven.vercel.app/users/info/",
      {headers: {Authorization: `Bearer ${token}`}}
    );
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }  
  
  const [stockList, setStockList] = useState([]);
  async function listStocks() {
    try {
      const response = await axios.get("https://stock-project-seven.vercel.app/stocks/listall", 
      {headers: {Authorization: `Bearer ${token}`}}
    );
      setNoStock(false);
      setStockList(response.data.map((item: { symbol: string }) => item.symbol));
    } catch (error) {
      setNoStock(true);
    }
  }

  useEffect(() => {
    listStocks();
    userInfo();
  }, []);

  useEffect(() => {}, [stockList]);
  useEffect(() => {}, [user]);

  const [selectedSymbol, setSelectedSymbol] = useState<string>("opcao1");

  const handleSymbolChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSymbol(event.target.value);
  };

  function updateAccount() {
    navigate("/update");
  }

  return (
    <main>
      <div className="mobile-header-container">
        <h1>Monitor de <br /> ações</h1>
        <div className="mobile-profile">
          <div className="mobile-user-name">Olá, {user?.name}</div>
          <div>
            <img
              className="mobile-option-icon mobile-gear-icon"
              onClick={updateAccount} 
              src="/images/gear.png" alt="" 
            />
            <img
              className="mobile-option-icon mobile-exit-icon"
              onClick={handleLogout} 
              src="/images/exit.png" alt="" 
            />
          </div>
        </div>
      </div>

      <div className="mobile-market-body">
        {loading && <LoadingCard />}
        {register && <RegisterStockCardMobile
          handleClose={() => setRegister(false)}
          stockName={stockName}
          stockSymbol={stockSymbol}
          stockPrice={stockPrice}       
        />}
        <div className="mobile-search-tab">
          <div className="mobile-search-field">
            <label>Procurar ação</label>
            <div className="mobile-search-ballon use-width">
              <input
                className="use-width mobile-default-input"
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
                className="mobile-use-height search-button"
                onClick={(e) => searchNewStock(e, search)}
              >
                pesquisar
              </button>
            </div>
          </div>
        </div>

       
        <div
            className="mobile-link-stocks">
          <a 
            href="https://www.b3.com.br/pt_br/market-data-e-indices/indices/indices-amplos/indice-ibovespa-ibovespa-composicao-da-carteira.htm" 
            target="_blank" 
            rel="noopener noreferrer">Ver lista de ações (ibovespa)
          </a>
        </div>
        

        {
          !noStock &&
          <div className="mobile-search-symbol">
            <select value={selectedSymbol} onChange={handleSymbolChange}>
              <option value="opcao1">Selecionar ação</option>
              {stockList.filter((value, index, self) => self.indexOf(value) === index).map((stock, index) => (
                <option key={index} value={stock}>
                  {stock}
                </option>
              ))}
            </select>
          </div>
        }

        {
          (!noStock || stock !== undefined) 
          && 
          <hr className='separation-line'/>
        }   


        <ol className="mobile-stock-board">
          {stock && (
            <StockCardToSim
              stock={stock}
              handleOpenRegisterCard={(name, symbol, price) => {
                setRegister(true);
                setStockName(name);
                setStockSymbol(symbol);
                setStockPrice(price);
              }}
              handleReturn={() => {setStock(undefined);}}
            />
          )}
          {
            <StockCardFromDB
              filterSymbol={selectedSymbol !== "opcao1" ? selectedSymbol : undefined}
            />
          }
          {
            noStock && !stock && <NoStockCardMobile/>
          }
        </ol>
      </div>
    </main>
  );
}

export default HomePage;