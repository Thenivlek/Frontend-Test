export const fetchSymbols = async (): Promise<string[]> => {
  const response = await fetch("https://api.binance.com/api/v3/exchangeInfo");
  const data = await response.json();
  return data.symbols.map((symbol: { symbol: string }) => symbol.symbol);
};
