import { useEffect, useState } from 'react';
import Cookies from "js-cookie";
import './styles/sellCard.css';
import axios from 'axios';

import { LoadingCard } from './LoadingCard';
import { SellRegisteredStockCard } from './SellRegisteredStockCard';

export type StockToSell = {
    stockName: string;
    stockSymbol: string;
    paidPriceSingle: number;
    sellPriceSingle: number;
    paidPrice: number;
    sellPrice: number;
    profit: number;
    proportionalProfit: string;
    taxes:number
}

type Props = {
    stockInfo: StockToSell;
    handleClose: () => void;
    id: number
}

const SellCard = ({ stockInfo: stockInfo, handleClose, id }: Props) => {

    const [loading, setLoading] = useState(false);
    const token = Cookies.get("refreshToken");
    
    const [stock, setStock] = useState<StockToSell>(stockInfo);
    
    useEffect(() => {
        setStock(stockInfo);
    }, [stockInfo]);

    async function SellStock(){
        setLoading(true);
        try {
            await axios.delete(`https://stock-project-seven.vercel.app/stocks/delone/${id}`,
            {headers: {Authorization: `Bearer ${token}`}}
            );
            window.location.reload();
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

   return (
    <>
    {loading && <LoadingCard/>}
    <div>        
        <div className="screen-blocker-lower">    
        <form className="sell-stock-form">
            
            <div className="title">
            Informações de venda
            </div>

            <div className="orientation-text">
                nome da ação
            </div>
            <div className="information-text">
                <span>{stock.stockName}</span>
                <span>{stock.stockSymbol}</span>
            </div>
            
            <div className="orientation-text padding-top">
                valor de venda
            </div>
            <div className="information-text">
                <span>
                    <span className='orientation-text'>R$</span>
                    <span className="money-earned">{stock.sellPrice.toFixed(2)}</span>
                </span>
                <span className='orientation-text'>{stock.sellPriceSingle.toFixed(2)}</span>
            </div>

            <div className="orientation-text padding-top">
                valor de compra (não cor)
            </div>
            <div className="information-text">
                <span>
                    <span className='orientation-text'>R$</span>
                    <span className="money-spent">{stock.paidPrice.toFixed(2)}</span>
                </span>
                <span className='orientation-text'>{stock.paidPriceSingle.toFixed(2)}</span>
            </div>
            <div className="orientation-text padding-top">
                Impostos
            </div>
            <div className="money-spent">
                <span className="orientation-text">R$</span> {stock.taxes.toFixed(2)}
            </div>
            
            <div className="orientation-text padding-top">
                lucro
            </div>
            <div>
                <span className="orientation-text">R$ </span>
                {stock.profit > 0 ? (
                    <span className="money-earned">{stock.profit.toFixed(2)}</span>
                ) : (
                    <span className="money-spent">{stock.profit}</span>
                )}
            </div>

            <div className="orientation-text padding-top">
                Porcentagem de lucro
            </div>
            <div className="information-text">
                {stock.profit > 0 ? (
                    <span className="money-earned">{stock.proportionalProfit}</span>
                ) : (
                    <span className="money-spent">{stock.proportionalProfit}</span>
                )}
            </div>

            <div className="next-buttons padding-top">
                <button type="button" className="green-button" onClick={SellStock}>Vender</button>
                <button type="button" className="gray-button" onClick={handleClose}>Cancelar</button>
            </div>
        </form>
        </div>    
    </div>
    </>
  )
}

export {SellCard}