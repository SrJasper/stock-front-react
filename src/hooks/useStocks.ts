import { StockToBuy } from "../components/types";
import { api } from "../config/api";

function useStocks() {
  async function useSellStock(id: number) {
    try {
      await api.delete(`/stocks/delone/${id}`);
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }

  async function useNewSimStock(stock: StockToBuy) {
    const symbol = stock.Symbol.toUpperCase();

    const data = {
      symbol: symbol,
      price: stock.Price,
      longName: stock.LongName,
      qnt: stock.qnt,
    };
    await api.post("/stocks/newsim", data);
  }  

  //exemplo de função de compra de ações
  async function buyStock(data: any) {
    try {
      await api.post("/stocks/newsim", data);
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }

  return { SellStock: useSellStock, useNewSimStock, buyStock };
}

export { useStocks };
