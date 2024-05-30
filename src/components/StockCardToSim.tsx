import { LoadingCard } from './LoadingCard';
import './styles/cardConfiguration.css';
import { useState } from 'react';
import Cookies from "js-cookie";
import './styles/stockCard.css';
import axios from 'axios';
import './styles/buyStockCard.css';

export type StockToRequestSim = {
  Symbol: string;
  LongName: string;
  Price: number;
}

type Props = {
  stock: StockToRequestSim;
  handleClose?: () => void;
  handleOpenRegisterCard?: (name: string, symbol: string, price: number) => void;
  handleReturn?: () => void;
}

const Card = ({ stock, handleClose }: Props) => {

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
    await axios.post("https://stock-project-seven.vercel.app/stocks/newsim", data, { headers: { Authorization: `Bearer ${token}` } });
    refreshPage();
  }

  return (
    <main>
      {loading && <LoadingCard />}
      <div className='screen-blocker'>
        <div className="card">
          <label> Quantidade à ser comprada </label><br />
          <input type="number" value={qnt} onChange={(e) => setQnt(parseFloat(e.target.value))} />
          <div className="button-field">
            <button className='sim-button green-button' onClick={simStock}> Comprar </button>
            <button className='sim-button gray-button' onClick={handleClose}> Cancelar </button>
          </div>
        </div>
      </div>
    </main>
  )
}


const StockCardToSim = ({ stock, handleOpenRegisterCard, handleReturn }: Props) => {

  const [card, setCard] = useState(false);
  let stockSymbol: string;
  if(stock.Symbol){
    stockSymbol = stock.Symbol.toUpperCase();
  } else{
    stockSymbol = 'tá inventando essa merda né campeão';
  }
  const stockName = stock.LongName;

  return (
    <>
      {card && <Card
        stock={stock}
        handleOpenRegisterCard={() => setCard(true)}
        handleClose={() => setCard(false)}
      />}
      <li className="stock ol-blocker">
        <div className="stock-name margin-left">
          <label > {stock.LongName}</label>
          <p className="big-font">{stockSymbol}</p>
        </div>
        <div className='stock-value big-font'>
          <p>R$</p>
          <p className='big-font'>{stock.Price ? stock.Price : 0}</p>
        </div>
        <div className='new-stock-buttons'>
          <button className="buy-button green-button" onClick={() => setCard(true)}>Comprar</button>
          <div className="alternative-buttons">
            <button className="register-stock-button gray-button"
              onClick={() => { handleOpenRegisterCard && handleOpenRegisterCard(stockName, stockSymbol, stock.Price); }}
            > Registrar </button>
            <button className="register-stock-button gray-button" onClick={handleReturn}> Cancelar </button>
          </div>
        </div>
      </li>
    </>
  )
}

export { StockCardToSim }