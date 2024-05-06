import { useState, useEffect } from 'react';
import Cookies from "js-cookie";
import axios from 'axios';  
import { SellCard, StockToSell } from './SellCard';
import { LoadingCard } from './LoadingCard';

export type Stock = {
  id: number
  operationDate: string
  symbol: string
  longName: string
  price: number
  qnt: number
  ownerId: number
  simulation: boolean
}

const StockCardFromDB = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const token = Cookies.get("refreshToken");
  const [card, setCard] = useState(false);
  const [stockInfo, setStockInfo] = useState<StockToSell>();
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axios.get("https://stock-project-seven.vercel.app/stocks/listall", 
      {headers: {Authorization: `Bearer ${token}`}}
    );
      setStocks(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();      
  }, []);

  async function GetStockInfo(id:number){

    setLoading(true);
    setCard(true);
    
    try {
      const response = await axios.post("https://stock-project-seven.vercel.app/stocks/sell", 
      {id},
      {headers: {Authorization: `Bearer ${token}`}}
    );
    setStockInfo(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  }
  useEffect(() => {
  }, [stockInfo]);
      
  return (
    <>
      {
      stocks.length > 0 ? (
        stocks.map((stock) => (
          <>
          {loading && <LoadingCard/>}
          {card && stockInfo && (
            <SellCard stockInfo={stockInfo}  handleClose={() => setCard(false)} id={stock.id} />
          )}
            <li className="stock" key={stock.id}>
              <div className="stock-name margin-left">
                <label > {stock.longName}</label>
                <p className="big-font">{stock.symbol}</p>
              </div>
              <div className="stock-info">
                <label className='sotck-label' >valor da compra</label>
                <div className='stock-value big-font'>
                  <p>R$</p>
                  <p className='big-font'>{stock.price ? stock.price : 0}</p>
                </div>
              </div>
              <div>
              <button className="buy-button green-button" onClick={() => GetStockInfo(stock.id)}>Vender</button>
              </div>
            </li>
          </>
        ))
        ) : (
          <p> Loading </p>
      )}
    </>
  );
}

export default StockCardFromDB;
