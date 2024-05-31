/* eslint-disable @typescript-eslint/no-explicit-any */
import { RegisterStockCard } from "../../components/RegisterStockCard";
import { StockCardToSim } from "../../components/StockCardToSim";
import StockCardFromDB from "../../components/StockCardFromDB";
import { LoadingCard } from "../../components/LoadingCard";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store/useAuth";
import { FormEvent, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import './HomeStyle.css';

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

  function registerCard(){
    setRegister(true);
  }

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
      <div className="header-container">
        <h1>Gestor de ações</h1>
        <div className="profile">
          <div className="user-name">Olá, {user?.name}</div>
          <div>
            <img
              className="option-icon gear-icon"
              onClick={updateAccount} 
              src="/images/gear.png" alt="" 
            />
            <img
              className="option-icon exit-icon"
              onClick={handleLogout} 
              src="/images/exit.png" alt="" 
            />
          </div>
        </div>
      </div>

      <div className="market-body">
        {loading && <LoadingCard />}
        {register && <RegisterStockCard
          handleClose={() => setRegister(false)}
          stockName={stockName}
          stockSymbol={stockSymbol}
          stockPrice={stockPrice}       
        />}
        <div className="search-tab">
          <div className="search-field use-height">
            <label>Procurar ação</label>
            <div className="search-ballon">
              <input
                className="use-height"
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
                className="use-height search-button"
                onClick={(e) => fetchStocks(e, search)}
              >
                pesquisar
              </button>
            </div>
          </div>
          
          <button className="reg-button use-height" onClick={() => {
              registerCard()
              setStockName("")
              setStockSymbol("")
              setStockPrice(undefined);
            }}>
            Registrar ação
          </button>
        </div>

        <a 
          className="link-stocks"
          href="https://www.b3.com.br/pt_br/market-data-e-indices/indices/indices-amplos/indice-ibovespa-ibovespa-composicao-da-carteira.htm" 
          target="_blank" 
          rel="noopener noreferrer">Ver lista de ações (ibovespa)
        </a>

        <div className="search-symbol">
          <select value={selectedSymbol} onChange={handleSymbolChange}>
            <option value="opcao1">Selecionar ação</option>
            {stockList.filter((value, index, self) => self.indexOf(value) === index).map((stock, index) => (
              <option key={index} value={stock}>
                {stock}
              </option>
            ))}
          </select>
        </div>


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
              handleReturn={() => {setStock(undefined);}}
            />
          )}
          {
            <StockCardFromDB
              filterSymbol={selectedSymbol !== "opcao1" ? selectedSymbol : undefined}
            />
          }
          <hr className='separation-line'/>
        </ol>
      </div>
    </main>
  );
}

export default HomePage;