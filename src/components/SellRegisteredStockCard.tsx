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

  function MakeCard(price: number, provents: number) {
    stock.price = price;
    stock.provents = provents;
    setCard(true);
  }

  const [price, setPrice] = useState(0);
  const [provents, setProvents] = useState(0);

  return (         
  <main>
  {card && stock && (
    <SellCard stock={stock}  handleClose={() => setCard(false)} />
  )}
  <div className='screen-blocker-lower'>
    <div className="card">
      <div>
        <label> Preço à ser vendida </label><br />
        <input type="number" onChange={(e) => {setPrice(Number(e.target.value))}}/>
      </div>
      <div className='margin-top'>
        <label> Proventos </label><br />
        <input type="number" onChange={(e) => {setProvents(Number(e.target.value))}}/>
      </div>
      <div className="button-field use-width">
        <button className='sim-button green-button use-width button-left-margin' onClick={() => MakeCard(price, provents)}> Vender </button>
        <button className='sim-button gray-button use-width button-margin-right' onClick={handleClose}> Cancelar </button>
      </div>
    </div>
  </div>
  </main>
  )
}

export {SellRegisteredStockCard}