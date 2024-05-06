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

export type userInfoHeader = {
  name: string,
  email: string
}

function HomePage() {

  const [search, setSearch] = useState("");

  const [stock, setStock] = useState();
  const [dbstockDisplay, setDBStockDisplay] = useState(true);
  
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
    setDBStockDisplay(false);
    const res = await axios.get("https://stock-project-seven.vercel.app/stocks/search/" + data, {headers: {Authorization: `Bearer ${token}`}})
    setStock(res.data);
    setLoading(false);
  }
  
  const [user, setUser] = useState<userInfoHeader>();
  async function userInfo() {
    try {
      const response = await axios.get("http:////stock-project-seven.vercel.app/users/info", 
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
  useEffect(() => {console.log(user)}, [user]);

  const [selectedSymbol, setSelectedSymbol] = useState<string>("opcao1");

  const handleSymbolChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSymbol(event.target.value);
  };

  return(
    <main>
      <div className="header-container">
        <h1>Stocks</h1>
        <div className="profile">
          <div className="user-name">Olá, {user?.name}</div>
          <div className="user-options">            
            <div >minha conta</div>
            <label>|</label>
            <div className="exit-button" onClick={handleLogout}> sair </div>
          </div>
        </div>
      </div>

      <div className="market-body">        
        
        {loading && <LoadingCard/>}
        {register && <RegisterStockCard/>}
                
        <div className="search-tab">
    
          <p>Procurar ação</p>
            <input  type="text" value={search} onChange={(e) => setSearch(e.target.value)}/>
            <button className="green-button" onClick={(e) => fetchStocks(e, search)}> pesquisar </button>
            <button className="reg-button gray-button" onClick={registerCard}> Registrar ação </button>
            
        </div>

        <div className="search-symbol">
          <select value={selectedSymbol} onChange={handleSymbolChange}>
            <option value="opcao1">Selecionar ação</option>
            {stockList.map((stock, index) => (
              <option key={index} value={stock}>{stock}</option>
            ))}
          </select>
        </div>

        <ol className="stock-board">
        {dbstockDisplay && <StockCardFromDB filterSymbol={selectedSymbol !== 'opcao1' ? selectedSymbol : undefined} />} 
          {stock && <StockCardToSim stock={stock}/>}
        </ol>
      </div>
    </main>
  )
}

export default HomePage;