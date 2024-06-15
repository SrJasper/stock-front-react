import { FormEvent } from "react";
import { StockToBuy } from "../components/types";
import { api } from "../config/api";

function useStocks() {

  async function useSellStock({ id, qnt }: { id: number; qnt?: number }) {
    console.log("id: ", id, "\nqnt: ", qnt);
    try {
      await api.post(`/stocks/sell/`, { id: id, qnt: qnt });
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

  async function useSearchNewStock({ e, data }: { e: FormEvent; data: string }) {
    e.preventDefault();
    try {
      const res = await api.get("/stocks/search/" + data);
      return res.data;
    } catch (error) {
      alert("Escreva algo para pesquisar!");
      throw error;
    }
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

  return { useSellStock, useNewSimStock, useSearchNewStock, buyStock};
}

export { useStocks };
