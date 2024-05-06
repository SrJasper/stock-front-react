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

function HomePage() {

  const [search, setSearch] = useState("");

  const [stock, setStock] = useState();
  const [dbstock, setDBStock] = useState(true);
  
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
    setDBStock(false);
    const res = await axios.get("https://stock-project-seven.vercel.app/stocks/search/" + data, {headers: {Authorization: `Bearer ${token}`}})
    setStock(res.data);
    setLoading(false);
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
  }, []);

  useEffect(() => {
    console.log(stockList);
  }, [stockList]);

  return(
    <main>
      <div className="header-container">
        <h1>Stocks</h1>
        <div>
            <div className="info">user</div>
            <div className="info">email@teste.com</div>
        </div>
        <div className="exit-button" onClick={handleLogout}> sair </div>
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
          <select>
            <option value="opcao1">Selecionar ação </option>
            {stockList.map((stock, index) => (
              <option key={index} value={stock}>{stock}</option>
            ))}
          </select>
        </div>

        <ol className="stock-board">
          {dbstock && <StockCardFromDB/>} 
          {stock && <StockCardToSim stock={stock}/>}
        </ol>
      </div>
    </main>
  )
}

export default HomePage;