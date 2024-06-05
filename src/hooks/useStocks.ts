import { api } from "../config/api";

function useStocks() {
  async function SellStock(id: number) {
    try {
      await api.delete(`/stocks/delone/${id}`);
    } catch (error) {
      console.error("Error fetching data:", error);
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

  return { SellStock, buyStock };
}

export { useStocks };
