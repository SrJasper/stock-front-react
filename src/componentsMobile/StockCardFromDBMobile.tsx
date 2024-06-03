import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { SellCard } from './SellCardMobile';
import { LoadingCard } from './LoadingCardMobile';
import { SellRegisteredStockCard } from './SellRegisteredStockCardMobile';
import { Stock } from './typesMobile';

const StockCardFromDBMobile: React.FC<{ filterSymbol?: string }> = ({ filterSymbol }) => {
  const token = Cookies.get('refreshToken');
  const [card, setCard] = useState(false);
  const [cardReg, setCardReg] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [stockToFindPrice, setStockToFindPrice] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [stockPriceFromApi, setStockPriceFromApi] = useState<string[]>([]);
  const [stockToPass, setStockToPass] = useState<Stock>();

  const fetchData = async () => {
    try {
      const response = await axios.get('https://stock-project-seven.vercel.app/stocks/listall',
        { headers: { Authorization: `Bearer ${token}` } }
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
    if (stock.simulation) {
      setCard(true);
    } else {
      setCardReg(true);
    }
  }

  return (
    <>
      {loading && <LoadingCard />}
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
              <li className='mobile-stock' key={stock.id}>
                <div className='mobile-stock-name'>
                  <label className='mobile-small-symbol-name'> {stock.longName.slice(0, 20)} </label>
                  <p className='mobile-symbol-name'>{stock.symbol}</p>
                </div>

                <div className='mobile-stock-comparison'>
                  <div className='mobile-stock-info'>
                    <label className='mobile-stock-label'>valor da compra</label>
                    <div className='mobile-stock-value mobile-value-font'>
                      <p className='mobile-big-font red-font'> {stock.price ? stock.price : 0}</p>
                    </div>
                  </div>
                  <div className='mobile-stock-info value-to-sell'>
                    <label className='mobile-stock-label' >valor atual</label>
                    <div className='mobile-stock-value mobile-value-font'>
                      <p className='mobile-big-font green-font'>{stockPriceFromApi[index] ? Number(stockPriceFromApi[index]) : 'Não'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    className={`mobile-buy-button ${Number(stockPriceFromApi[index]) > stock.price ? 'green-button' : 'red-button'}`}
                    onClick={() => SellStockCard(stock)}
                  >
                    Vender
                  </button>
                </div>
              </li>
              
            <hr className='separation-line' />
            </>
          ))
      ) : (
        <></>
      )}
    </>
  );
}

export default StockCardFromDBMobile;
