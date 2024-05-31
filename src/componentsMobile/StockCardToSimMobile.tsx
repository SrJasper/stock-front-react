import { LoadingCard } from './LoadingCardMobile';
import './styles/cardConfiguration.css';
import { useState } from 'react';
import Cookies from 'js-cookie';
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
  const token = Cookies.get('refreshToken')

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
    await axios.post('https://stock-project-seven.vercel.app/stocks/newsim', data, { headers: { Authorization: `Bearer ${token}` } });
    refreshPage();
  }

  return (
    <main>
      {loading && <LoadingCard />}
      <div className='screen-blocker'>
        <div className='card'>
          <label> Quantidade à ser comprada </label><br />
          <input className='default-input margin-top' type='number' value={qnt} onChange={(e) => setQnt(parseFloat(e.target.value))} />
          <div className='button-field'>
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
  if (stock.Symbol) {
    stockSymbol = stock.Symbol.toUpperCase();
  } else {
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
      <hr className='separation-line' />
      <li className='mobile-buy-card ol-blocker'>
        <div className='mobile-upper-info use-width'>
          <div className='mobile-stock-name'>
            <label className='mobile-stock-long-name'> {stock.LongName}</label>
            <p className='mobile-symbol-font'>{stockSymbol}</p>
          </div>
          <div className='mobile-stock-name'>
            <label className='mobile-stock-long-name'>Valor</label>
            <span className='value-new-stock'>
              <p className='mobile-symbol-font'>{stock.Price ? stock.Price : 0}</p>
            </span>
          </div>
        </div>
        <div className='mobile-new-stock-buttons use-width'>
          <button className='buy-button green-button use-width' onClick={() => setCard(true)}>Comprar</button>
          <div className='alternative-buttons use-width'>
            <button className='register-stock-button use-width'
              onClick={() => { handleOpenRegisterCard && handleOpenRegisterCard(stockName, stockSymbol, stock.Price); }}
            > Registrar </button>
            <button className='register-stock-button use-width' onClick={handleReturn}> Cancelar </button>
          </div>
        </div>
      </li>
    </>
  )
}

export { StockCardToSim }