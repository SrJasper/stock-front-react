import { Stock } from '../types';
import { api } from '../../config/api';

const listStocks = async (
  setStockToFindPrice: React.Dispatch<React.SetStateAction<string[]>>
): Promise<Stock[]> => {
  try {
    const response = await api.get("/stocks/listall");

    if (response.data.length !== 0) {
      const symbolsToFindPrice = response.data
        .filter((stock: Stock) => stock.qnt !== 0) // Filtra apenas os stocks com qnt diferente de 0
        .map((stock: Stock) => stock.symbol);
      setStockToFindPrice(symbolsToFindPrice);
      return response.data;
    } else {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export { listStocks };
