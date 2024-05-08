
import { useState } from 'react';
import './styles/registerCard.css';

type Props = {
  handleClose: () => void;
}

const RegisterStockCard = ({ handleClose }: Props) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  return (
    <div className="screen-blocker">
      <form className="register-stock-form">
        <div className="title">
          Registrar nova ação
        </div>
        <div className="input-box padding-top">
          <label>Nome da ação</label>
          <input type="text" />
        </div>
        <div className="input-box padding-top">
          <div className="input-row">
            <label>Simbolo da ação</label>
            <label className='mark'> ⓘ </label>
          </div>
          <input type="text" />
        </div>
        <div className="input-box padding-top">
          <label>Quantidade</label>
          <input type="text" />
        </div>
        <div className="input-box padding-top">
          <label>Preço</label>
          <input type="text" />
        </div>
        <div className="input-box padding-top">
          <label>Data de compra</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="register-buttons padding-top">
          <button type="button" className="green-button">registrar</button>          
          <button type="button" className="gray-button" onClick={handleClose}>cancelar</button>          
        </div>
      </form>
    </div>
  );
}

export { RegisterStockCard };
