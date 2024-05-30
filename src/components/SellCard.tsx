
import { useEffect, useState } from 'react';
import { LoadingCard } from './LoadingCard';
import Cookies from "js-cookie";
import './styles/sellCard.css';
import axios from 'axios';
import { Stock, StockToSell } from './types';

type Props = {
  stock: Stock;
  date?: Date;
  handleClose: () => void;
}

const SellCard: React.FC<Props> = ({ stock, handleClose })=> {
    
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("refreshToken");

  const [card, setCard] = useState(false);
  const [stockInfo, setStockInfo] = useState<StockToSell>();

  useEffect(() => {GotInfo();}, [stock]);
  async function GotInfo() {
    setLoading(true);        
    try {
      console.log(
      'id: ' + stock.id +
      '\nsellPrice: ' + stock.price +
      '\nprovents: ' + stock.provents +
      '\ndate: ' + stock.operationDate);
      const response = await axios.post("https://stock-project-seven.vercel.app/stocks/sell",
        {   
          id: stock.id,
          sellPrice: stock.price,
          provents: stock.provents,
          date: stock.operationDate
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStockInfo(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
      setLoading(false);
  }
  useEffect(() => {
      setCard(true);
  }, [stockInfo]);

  async function SellStock() {
    setLoading(true);
    try {
      await axios.delete(`https://stock-project-seven.vercel.app/stocks/delone/${stock.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.location.reload();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  return (
    <>
      {loading && <LoadingCard />}
      {card && stockInfo && 
      <> 
      <div>
        <div className="screen-blocker">
          <form className="sell-stock-form">

            <div className="title">
              Informações de venda
            </div>

            <div className="orientation-text">
                    nome da ação
                </div>
                <div className="information-text">
                    <span>{stockInfo.stockName}</span>
                    <span>{stockInfo.stockSymbol}</span>
                </div>

                <div className="orientation-text padding-top">
                    valor de venda
                </div>
                <div className="information-text">
                    <span>
                        <span className='orientation-text'>R$</span>
                        <span className="money-earned">{stockInfo.sellPrice.toFixed(2)}</span>
                    </span>
                    <span className='orientation-text'>{stockInfo.sellPriceSingle}</span>
                </div>

                <div className="orientation-text padding-top">
                    valor de compra (não cor)
                </div>
                <div className="information-text">
                    <span>
                        <span className='orientation-text'>R$</span>
                        <span className="money-spent">{stockInfo.paidPrice.toFixed(2)}</span>
                    </span>
                    <span className='orientation-text'>{stockInfo.paidPriceSingle}</span>
                </div>
                <div className="orientation-text padding-top">
                    Impostos
                </div>
                <div className="money-spent">
                    <span className="orientation-text">R$</span> {stockInfo.taxes.toFixed(2)}
                </div>

                <div className="orientation-text padding-top">
                    lucro
                </div>
                <div>
                    <span className="orientation-text">R$ </span>
                    {stockInfo.profit > 0 ? (
                        <span className="money-earned">{stockInfo.profit.toFixed(2)}</span>
                    ) : (
                        <span className="money-spent">{stockInfo.profit.toFixed(2)}</span>
                    )}
                </div>

                <div className="orientation-text padding-top">
                    Porcentagem de lucro
                </div>
                <div className="information-text">
                    {stockInfo.profit > 0 ? (
                        <span className="money-earned">{stockInfo.proportionalProfit}</span>
                    ) : (
                        <span className="money-spent">{stockInfo.proportionalProfit}</span>
                    )}
                </div>

                <div className="next-buttons padding-top">
                    <button type="button" className="green-button" onClick={SellStock}>Vender</button>
                    <button type="button" className="gray-button" onClick={handleClose}>Cancelar</button>
                </div>
            </form>
        </div>
    </div>
    </>}
  </>
  )
}

export { SellCard }