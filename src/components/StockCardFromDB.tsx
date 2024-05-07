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

const StockCardFromDB: React.FC<{ filterSymbol?: string }> = ({ filterSymbol }) => {
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
      setStockToFindPrice(response.data.map((stock: Stock) => stock.symbol));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();  
  }, []);

  
  
  const [stockToFindPrice, setStockToFindPrice] = useState([]);
  const [stockPriceFromApi, setStockPriceFromApi] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  async function StockPriceFromAPI(data: string[]) {
    setLoading(true);
    const prices = [];
    for (const stockToBePriced of data) {
      const res = await axios.get(`https://stock-project-seven.vercel.app/stocks/search/${stockToBePriced}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      prices.push(res.data.Price);
    }
    setStockPriceFromApi(prices);
    setLoaded(true);
    setLoading(false);
  }

  useEffect(() => {
    if (stockToFindPrice.length > 0 && !loaded) {
      StockPriceFromAPI(stockToFindPrice);
    }
  }, [stockToFindPrice, loaded]);

  useEffect(() => {}, [stockPriceFromApi]);

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
      {stocks.length > 0 ? (
        stocks
          .filter(stock => !filterSymbol || stock.symbol.includes(filterSymbol))
          .map((stock, index) => (
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
              
              <div className="stock-comparison">
                <div className="stock-info value-bought">
                  <label className='sotck-label' >valor da compra</label>
                  <div className='stock-value big-font'>
                    <p>R$</p>
                    <p className='big-font'>{stock.price ? stock.price : 0}</p>
                  </div>
                </div>
                <div className="stock-info value-to-sell">
                  <label className='sotck-label' >valor atual</label>
                  <div className='stock-value big-font'>
                    <p>R$</p>
                    <p className='big-font'>{stockPriceFromApi[index] ? Number(stockPriceFromApi[index]) : 0}</p>
                  </div>
                </div>
              </div>
              
              <div>
                {Number(stockPriceFromApi[index]) > stock.price ? (
                  <button className="buy-button green-button" onClick={() => GetStockInfo(stock.id)}>Vender</button>
                ) : (
                  <button className="buy-button red-button" onClick={() => GetStockInfo(stock.id)}>Vender</button>
                )}
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
