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
          <input className='default-input margin-top' type="number" value={qnt} onChange={(e) => setQnt(parseFloat(e.target.value))} />
          <div className="button-field">
            <button className='use-width sim-button green-button' onClick={simStock}> Comprar </button>
            <button className='use-width sim-button' onClick={handleClose}> Cancelar </button>
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
    return(
      <>
        <div className='no-stock-card'>
            <h2>Símbolo não encontrado</h2>
            <p>
              Você pode olhar no link para ver uma lista com símbolos
              de ações disponíveis ou tentar novamente com outro símbolo.
            </p>
        </div>
      </>
    )
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
        <div className="stock-name">
          <label > {stock.LongName}</label>
          <p className="big-font">{stockSymbol}</p>
        </div>
        <div className='stock-value-sim'>
          <p>Valor da compra</p>
          <span className='value-new-stock'>
            <p className='big-font'>{stock.Price ? stock.Price : 0}</p>
          </span>
        </div>
        <div className='new-stock-buttons'>
          <button className="buy-button margin-right green-button" onClick={() => setCard(true)}>Comprar</button>
          <div className="alternative-buttons">
            <button className="register-stock-button"
              onClick={() => { handleOpenRegisterCard && handleOpenRegisterCard(stockName, stockSymbol, stock.Price); }}
            > Registrar </button>
            <button className="register-stock-button" onClick={handleReturn}> Cancelar </button>
          </div>
        </div>
      </li>
      <hr className='separation-line'/>
    </>
  )
}

export { StockCardToSim }