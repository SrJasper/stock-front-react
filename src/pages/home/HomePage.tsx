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
    console.log(response.data);
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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      fetchStocks(e, search);
    }
  };

  function updateAccount() {
    navigate("/update");
  }

  return (
    <main>
      <div className="header-container">
        <h1>Stocks</h1>
        <div className="profile">
          <div className="user-name">Olá, {user?.name}</div>
          <div className="user-options">
            <p onClick={updateAccount}>minha conta</p>
            <label>|</label>
            <p className="exit-button" onClick={handleLogout}>
              sair
            </p>
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
          <div className="search-field">
            <label>Procurar ação</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              className="green-button"
              onClick={(e) => fetchStocks(e, search)}
            >
              pesquisar
            </button>
          </div>
          <button className="gray-button reg-button" onClick={() => {
              registerCard()
              setStockName("")
              setStockSymbol("")
              setStockPrice(undefined);
            }}>
            Registrar ação
          </button>
        </div>

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
        </ol>
      </div>
    </main>
  );
}

export default HomePage;