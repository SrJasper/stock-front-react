import { useStock } from "../contexts/stockContext";
import { Stock, StockToBuy } from "../components/types";
import { api } from "../config/api";
import { FormEvent } from "react";

function useStocks() {
  const { setStock } = useStock();

  const normalizeStock = (stockToBuy: StockToBuy): Stock => {
    return {
      id: 0,
      operationDate: "",
      symbol: stockToBuy.Symbol,
      longName: stockToBuy.LongName,
      price: stockToBuy.Price,
      qnt: stockToBuy.qnt || 0,
      provents: 0,
      ownerId: 0,
      simulation: false,  
      type: "",
    };
  };

  async function useSellStock({
    symbol,
    qnt,
    simulation,
    id,
  }: {
    symbol: string;
    qnt?: number;
    simulation: boolean;
    id: number;
  }) {
    try {
      console.log(
        "id: ",
        id,
        "\nsymbol: ",
        symbol,
        "\nqnt: ",
        qnt,
        "\nsimulation: ",
        simulation
      );
      await api.post(`/stocks/sell/`, {
        symbol: symbol,
        qnt: qnt,
        simulation: simulation,
        id: id,
      });
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

  async function useSearchNewStock({
    e,
    data,
  }: {
    e: FormEvent;
    data: string;
  }) {
    e.preventDefault();
    try {
      const res = await api.get("/stocks/search/" + data);
      console.log("res.data: ", res.data);
      const normalizedStock = normalizeStock(res.data);
      setStock(normalizedStock);
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

  return { useSellStock, useNewSimStock, useSearchNewStock, buyStock };
}

export { useStocks };
