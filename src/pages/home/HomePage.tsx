/* eslint-disable @typescript-eslint/no-explicit-any */
import { RegisterStockCard } from "../../components/RegisterStockCard";
import { StockCardToSim } from "../../components/StockCardToSim";
import StockCardFromDB from "../../components/StockCardFromDB";
import { LoadingCard } from "../../components/LoadingCard";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store/useAuth";
import { FormEvent, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import './HomeStyle.css';

function HomePage() {

  const [search, setSearch] = useState("");

  const [stock, setStock] = useState();
  const [dbstock, setDBStock] = useState(true);
  
  const [loading, setLoading] = useState(false);
  const [register, setRegister] = useState(false);

  const token = Cookies.get("refreshToken")

  async function fetchStocks(e:FormEvent ,data: string) {
    e.preventDefault();
    setLoading(true);
    setDBStock(false);
    const res = await axios.get("https://stock-project-seven.vercel.app/stocks/search/" + data, {headers: {Authorization: `Bearer ${token}`}})
    setStock(res.data);
    setLoading(false);
  }

  function registerCard(){
    setRegister(true);
  }

  const navigate = useNavigate();

  const {logout} = useAuth()

  function handleLogout() {
    navigate("/")
    logout()
  }

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
            <option value="opcao1"> Selecionar ação </option>
            <option value="opcao2">Opção 2</option>
            <option value="opcao3">Opção 3</option>
          </select>
        </div>

        <ol className="stock-board">
          {dbstock && <StockCardFromDB/>}   
          {stock && <StockCardToSim stock={stock} />}
        </ol>
      </div>
    </main>
  )
}

export default HomePage;