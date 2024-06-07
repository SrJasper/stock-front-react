export type StockToSell = {
  stockName: string;
  stockSymbol: string;
  paidPriceSingle: number;
  sellPriceSingle: number;
  paidPrice: number;
  sellPrice: number;
  profit: number;
  proportionalProfit: string;
  taxes: number;
};

export type StockToBuy = {
  Symbol: string;
  LongName: string;
  Price: number;
  qnt?: number;
};

export type Stock = {
  id: number;
  operationDate: string;
  symbol: string;
  longName: string;
  price: number;
  qnt: number;
  provents?: number | 0;
  ownerId: number;
  simulation: boolean;
};
