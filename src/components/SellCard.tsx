import { useEffect, useState } from 'react';
import './styles/sellCard.css';

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
    stock: StockToSell;
    handleClose: () => void
}

const SellCard = ({ stock: stockInfo, handleClose }: Props) => {

    const [stock, setStock] = useState<StockToSell>(stockInfo);

    useEffect(() => {
        setStock(stockInfo);
    }, [stockInfo]);

   return (
    <>
    <div className="screen-blocker">    
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
            valor vendido
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
            <button type="button" className="green-button">Vender</button>
            <button type="button" className="gray-button" onClick={handleClose}>Cancelar</button>
        </div>
    </form>
    </div>
    </>
  )
}

export {SellCard}