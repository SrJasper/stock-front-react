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

  function MakeCard(price: number) {
    stock.price = price;
    setCard(true);
  }

  const [price, setPrice] = useState(0);
  return (         
  <main>
  {card && stock && (
    <SellCard stock={stock}  handleClose={() => setCard(false)} />
  )}
  <div className='screen-blocker-lower'>
    <div className="card">
      <label> Preço à ser vendida </label><br />
      <input type="number" onChange={(e) => {setPrice(Number(e.target.value))}}/>
      <div className="button-field">
        <button className='sim-button green-button' onClick={() => MakeCard(price)}> Vender </button>
        <button className='sim-button gray-button' onClick={handleClose}> Cancelar </button>
      </div>
    </div>
  </div>
  </main>
  )
}

export {SellRegisteredStockCard}