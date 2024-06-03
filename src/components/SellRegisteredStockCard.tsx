import './styles/sellCard.css';
import { useState } from "react";
import { Stock } from './types';
import { SellCard } from './SellCard';

type Props = {
  stock: Stock;
  handleClose: () => void;  
}

const SellRegisteredStockCard = ({ stock, handleClose } : Props) => {
    
  const [card, setCard] = useState(false);

  function MakeCard(price: number, provents: number, sellDate: Date | undefined) {
    stock.price = price;
    stock.provents = provents;
    if(sellDate){
      const date = new Date(sellDate.toString());
      const isoString = date.toISOString();
      stock.operationDate = isoString;
    } else {
      stock.operationDate = new Date().toISOString();
    }
    setCard(true);
  }

  const [price, setPrice] = useState(0);
  const [provents, setProvents] = useState(0);
  const [sellDate, setSellDate] = useState<Date>();

  return (         
  <main>
  {card && stock && (
    <SellCard stock={stock} date={sellDate} handleClose={() => setCard(false)} />
  )}
  <div className='screen-blocker-lower'>
    <div className="card">
      <div>
        <label> Preço à ser vendida </label><br />
        <input className='default-input' type="number" onChange={(e) => {setPrice(Number(e.target.value))}}/>
      </div>
      <div className='margin-top'>
        <label> Proventos </label><br />
        <input className='default-input' type="number" onChange={(e) => {setProvents(Number(e.target.value))}}/>
      </div>
      <div className='margin-top'>
        <label> Data da venda </label><br />
        <input className='default-input' type="date" 
        defaultValue={new Date().toISOString().split('T')[0]} 
        onChange={(e) => {setSellDate(new Date(e.target.value))}}/>
      </div>
      
      <div className="button-field use-width">
        <button className='sim-button green-button use-width button-left-margin' onClick={() => MakeCard(price, provents, sellDate)}> Vender </button>
        <button className='sim-button use-width button-margin-right' onClick={handleClose}> Cancelar </button>
      </div>
    </div>
  </div>
  </main>
  )
}

export {SellRegisteredStockCard}