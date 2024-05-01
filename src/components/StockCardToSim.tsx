import { LoadingCard } from './LoadingCard';
import './styles/cardConfiguration.css';
import { useState } from 'react';
import Cookies from "js-cookie";
import './styles/stockCard.css';
import axios from 'axios';

export type Stock = {
  Symbol: string;
  LongName: string;
  Price: number
}

type Props = {
  stock: Stock;
  handleClose: () => void
}

const Card = ({stock, handleClose}: Props) => {

  const [qnt, setQnt] = useState(0);  
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("refreshToken")

  const refreshPage = () => {
    window.location.reload();
  }


  async function simStock() {

    const symbol = stock.Symbol.toUpperCase();

    const data = {
      symbol: symbol,
      price: stock.Price,
      longName: stock.LongName,
      qnt: qnt
    };
    setLoading(true);
    await axios.post("https://stock-project-seven.vercel.app/stocks/newsim", data, {headers: {Authorization: `Bearer ${token}`}});    
    refreshPage();
  }

  return (
    <main>
    {loading && <LoadingCard/>}
    <div className='screen-blocker'>
      <div className="card">
        <label> Quantidade à ser comprada </label><br />
        <input type="number" value={qnt} onChange={(e) => setQnt(parseFloat(e.target.value))}/>
        <div className="button-field">
          <button className='sim-button green-button' onClick={simStock}> Comprar </button>
          <button className='sim-button gray-button' onClick={handleClose}> Cancelar </button>
        </div>
      </div>
    </div>
    </main>
  )
}

const StockCardToSim = ({stock}: {stock: Stock}) => {

  const [card, setCard] = useState(false);
  
  return (
    <main>
    {card && <Card handleClose={() => setCard(false)} stock={stock}/>}
    <li className="stock">
      <div className="stock-name">
        <p className="stock-title">
          {stock.LongName}
        </p>
        <p className="stock-symbol">
          {stock.Symbol.toUpperCase()}
        </p>                    
      </div>
      <div className="stock-info">
          <p>R$</p>
          <p className="stockValue">{stock.Price ? stock.Price : 0}</p>
      </div>
      <div>                             
        <button className="buy-button green-button" onClick={() => setCard(true)}>Comprar</button>
        <button className="register-stock-button gray-button"> Registrar </button>
      </div>                        
    </li>    
    </main>
  )
}

export  { StockCardToSim }