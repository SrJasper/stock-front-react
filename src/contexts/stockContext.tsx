import { createContext, useState, ReactNode, useContext } from "react";
import { Stock } from "../components/types"; // Ajuste o caminho conforme necessário

// Função para normalizar StockToBuy para Stock


type StockContextType = {
  stock: Stock | null;
  setStock: React.Dispatch<React.SetStateAction<Stock | null>>;
};

const defaultStockContext: StockContextType = {
  stock: null,
  setStock: () => {},
};

export const StockContext =
  createContext<StockContextType>(defaultStockContext);

type StockProviderProps = {
  children: ReactNode;
};

export const StockProvider = ({ children }: StockProviderProps) => {
  const [stock, setStock] = useState<Stock | null>(null);

  return (
    <StockContext.Provider value={{ stock: stock, setStock: setStock }}>
      {children}
    </StockContext.Provider>
  );
};

// Custom hook for using the UserContext
export const useStock = () => useContext(StockContext);
