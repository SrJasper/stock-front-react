import './styles/registerCard.css';
import { useState } from 'react';
import Cookies from "js-cookie";  
import axios from 'axios';

type Props = {
  handleClose: () => void;
  stockName?: string;
  stockSymbol?: string;
  stockPrice?: number | undefined;
}

const RegisterStockCard = ({ handleClose, stockName, stockSymbol, stockPrice }: Props) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const token = Cookies.get("refreshToken");

  async function registerStock() {

    const data = {
      symbol: newStockSymbol,
      longName: newStockName,
      price: newStockPrice,
      qnt: quantity,
      operationDate: date,
    };

    await axios.post("http://localhost:3000/stocks/regsim", data, 
    {headers: {Authorization: `Bearer ${token}`}}
    );
  }

  
  const [ newStockName, setNewStockName ] = useState(stockName || "");
  const [ newStockPrice, setNewStockPrice ] = useState<number>(stockPrice || 0);
  const [ newStockSymbol, setNewStockSymbol ] = useState(stockSymbol || "");  
  const [quantity, setQuantity] = useState(0);

  return (
    <div className="screen-blocker">
      <form className="register-stock-form">
        <div className="title">
          Registrar nova ação
        </div>
        <div className="input-box padding-top">
          <label>Nome da ação</label>
          <input type="text" value={newStockName} onChange={(e) => setNewStockName(String(e.target.value))}/>
        </div>
        <div className="input-box padding-top">
          <div className="input-row">
            <label>Simbolo da ação</label>
            <label className='mark'> ⓘ </label>
          </div>
          <input type="text" value={newStockSymbol} onChange={(e) => setNewStockSymbol(String(e.target.value))}/>
        </div>
        <div className="input-box padding-top">
          <label>Quantidade</label>
          <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}/>
        </div>
        <div className="input-box padding-top">
          <label>Preço</label>
          <input type="number" value={newStockPrice} onChange={(e) => setNewStockPrice(Number(e.target.value))}/>
        </div>
        <div className="input-box padding-top">
          <label>Data de compra *</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="register-buttons padding-top">
          <button type="button" className="green-button" onClick={() => {registerStock(); handleClose()}}>registrar</button>          
          <button type="button" className="gray-button" onClick={handleClose}>cancelar</button>          
        </div>
      </form>
    </div>
  );
}

export { RegisterStockCard };
