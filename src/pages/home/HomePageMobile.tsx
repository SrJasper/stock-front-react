/* eslint-disable @typescript-eslint/no-explicit-any */
import { RegisterStockCardMobile } from "../../componentsMobile/RegisterStockCardMobile";
import { StockCardToSim } from "../../componentsMobile/StockCardToSimMobile";
import StockCardFromDB from "../../componentsMobile/StockCardFromDBMobile";
import { LoadingCard } from "../../componentsMobile/LoadingCardMobile";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../store/useAuth';
import Cookies from "js-cookie";
import axios from "axios";
import './HomeStyleMobile.css';

type userInfo = {
  id: string;
  email: string;
  name?: string;
}

function HomePage() {

  const [search, setSearch] = useState("");

  const [stock, setStock] = useState();

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

  async function fetchStocks(e:FormEvent ,data: string) {
    e.preventDefault();
    setLoading(true);
    const res = await axios.get("https://stock-project-seven.vercel.app/stocks/search/" + data, {headers: {Authorization: `Bearer ${token}`}})
    if(res.data){
      setStock(res.data);
      setLoading(false);
    } else{ 
      setLoading(false);
      alert("Símbolo não encontrado");
    }
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
      setStockList(response.data.map((item: { symbol: string }) => item.symbol));
    } catch (error) {
      console.error('Error fetching data:', error);
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
        <h1>Gestor de <br /> ações</h1>
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
                    fetchStocks(e, search);
                  }
                }}
              />
              <button
                className="mobile-use-height search-button"
                onClick={(e) => fetchStocks(e, search)}
              >
                pesquisar
              </button>
            </div>
          </div>
        </div>

        <a 
          className="mobile-link-stocks"
          href="https://www.b3.com.br/pt_br/market-data-e-indices/indices/indices-amplos/indice-ibovespa-ibovespa-composicao-da-carteira.htm" 
          target="_blank" 
          rel="noopener noreferrer">Ver lista de ações (ibovespa)
        </a>

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
          <hr className='mobile-separation-line'/>
        </ol>
      </div>
    </main>
  );
}

export default HomePage;