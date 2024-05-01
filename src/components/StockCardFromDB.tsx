  import { useState, useEffect } from 'react';
  import Cookies from "js-cookie";
  import axios from 'axios';  

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
    const token = Cookies.get("refreshToken")

    const fetchData = async () => {
      try {
        const response = await axios.get("https://stock-project-seven.vercel.app/stocks/listall", 
        {headers: {Authorization: `Bearer ${token}`}}
      );
        //Colocar pra puxar o stock pelo índice do user 
        setStocks(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    useEffect(() => {
      fetchData();
      
    }, []);
        
    return (
      <>
        {
        stocks.length > 0 ? (
          stocks.map((stock) => (      
  
              <li className="stock" key={stock.id}>
              <div className="stock-name">
              <p className="stock-symbol">{ stock.symbol }</p>
              </div>
              <div className="stock-info">
                <p>R$</p>
                <p className="stockValue">{stock.price ? stock.price : 0}</p>
              </div>
              <div>
                <button className="buy-button green-button">Vender</button>
              </div>
            </li>
    
          ) )
          ) : (
            <p> Loading </p>
        )}
      </>
    );
  }

  export default StockCardFromDB;
