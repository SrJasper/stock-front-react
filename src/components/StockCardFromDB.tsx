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
  const [cardReg, setCardReg] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [stockToPass, setStockToPass] = useState<Stock>();
  const [stockToFindPrice, setStockToFindPrice] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [stockPriceFromApi, setStockPriceFromApi] = useState<string[]>([]);

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

  const StockPriceFromAPI = async (data: string[]) => {
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
  };

  useEffect(() => {
    fetchData();  
  }, []);

  useEffect(() => {
    if (stockToFindPrice.length > 0 && !loaded) {
      StockPriceFromAPI(stockToFindPrice);
    }
  }, [stockToFindPrice, loaded]);

  async function SellStockCard(stock: Stock) {
    setStockToPass(stock);
    if(stock.simulation){
      setCard(true);
    } else {    
      setCardReg(true);
    }
  }

  return (
    <>
      {loading && <LoadingCard/>}
      {/* {card && stocks.find(s => s.simulation) && (
        <SellCard stock={stocks.find(s => s.simulation)!} handleClose={() => setCard(false)} />
      )} */}
      {card && stockToPass && (
        <SellCard stock={stockToPass} handleClose={() => setCard(false)} />
      )}
      {cardReg && stocks.find(s => !s.simulation) && (
        <SellRegisteredStockCard stock={stocks.find(s => !s.simulation)!} handleClose={() => setCardReg(false)} />
      )}
      {stocks.length > 0 ? (
        stocks
          .filter(stock => !filterSymbol || stock.symbol.includes(filterSymbol))
          .map((stock, index) => (
            <>
              <li className="stock" key={stock.id}>
                <div className="stock-name">
                  <label className='small-font'> {stock.longName}</label>
                  <p className="big-font">{stock.symbol}</p>
                </div>
                
                <div className="stock-comparison">
                  <div className="stock-info">
                    <label className='stock-label small-font'>valor da compra</label>
                    <div className='stock-value big-font'>
                      <p className='big-font red-font'> {stock.price ? stock.price : 0}</p>
                    </div>
                  </div>
                  <div className="stock-info value-to-sell">
                    <label className='stock-label small-font' >valor atual</label>
                    <div className='stock-value big-font'>
                      <p className='big-font green-font'>{stockPriceFromApi[index] ? Number(stockPriceFromApi[index]) : "Não"}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <button
                    className={`buy-button ${Number(stockPriceFromApi[index]) > stock.price ? "green-button" : "red-button"}`}
                    onClick={() => SellStockCard(stock)}
                  >
                    Vender
                  </button>
                </div>
              </li>
              <hr className='separation-line'/>
            </>
          ))
        ) : (
        <></>
      )}
    </>
  );
}

export default StockCardFromDB;
