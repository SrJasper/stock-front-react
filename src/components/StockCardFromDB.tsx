import { useState, useEffect } from 'react';
import Cookies from "js-cookie";
import axios from 'axios';  
import { SellCard } from './SellCard';
import { LoadingCard } from './LoadingCard';
import { SellRegisteredStockCard } from './SellRegisteredStockCard';
import { Stock } from './types';



const StockCardFromDB: React.FC<{ filterSymbol?: string }> = ({ filterSymbol }) => {
  const token = Cookies.get("refreshToken");
  const [card, setCard] = useState(false);

  
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [stockToFindPrice, setStockToFindPrice] = useState([]);
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
  }
  useEffect(() => {
    fetchData();  
  }, []);


  
  const [cardReg, setCardReg] = useState(false);
  const [loading, setLoading] = useState(false);
  async function SellStockCard(stock: Stock) {

    if(stock.simulation){
      setCard(true);
    } else {    
      setCardReg(true);
    }
  }


  const [loaded, setLoaded] = useState(false);
  const [stockPriceFromApi, setStockPriceFromApi] = useState<string[]>([]);
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
 

  return (
    <>
      {stocks.length > 0 ? (
        stocks
          .filter(stock => !filterSymbol || stock.symbol.includes(filterSymbol))
          .map((stock, index) => (
          <>
          {loading && <LoadingCard/>}          
          {card && (
            <SellCard stock={stock} handleClose={()=>setCard(false)}/>
          )}
          {cardReg && (
            <SellRegisteredStockCard stock={stock} handleClose={() => setCardReg(false)} />
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
                    <p className='big-font'>{'R$'+stockPriceFromApi[index] ? Number(stockPriceFromApi[index]) : "Não"}</p>
                  </div>
                </div>
              </div>
              
              <div>
                {Number(stockPriceFromApi[index]) > stock.price ? (
                  <button className="buy-button green-button" onClick={() => SellStockCard(stock)}>Vender</button>
                ) : (
                  <button className="buy-button red-button" onClick={() => SellStockCard(stock)}>Vender</button>
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
