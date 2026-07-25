'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type CurrencyData = {
  symbol: string;
  code: string;
  rate: number; // Rate relative to USD (1 USD = X Currency)
};

const defaultCurrency: CurrencyData = {
  symbol: '₹',
  code: 'INR',
  rate: 1,
};

type CurrencyContextType = {
  currency: CurrencyData;
  formatPrice: (usdAmount: number, compact?: boolean) => string;
};

const CurrencyContext = createContext<CurrencyContextType>({
  currency: defaultCurrency,
  formatPrice: (amount) => `₹${amount.toLocaleString()}`,
});

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency] = useState<CurrencyData>(defaultCurrency);

  const formatPrice = (usdAmount: number, compact: boolean = false) => {
    const convertedAmount = usdAmount * currency.rate;

    if (compact) {
      if (convertedAmount >= 10_000_000) {

        const val = (convertedAmount / 10_000_000).toFixed(1);
        return `${currency.symbol}${val.endsWith('.0') ? val.slice(0, -2) : val}Cr`;
      } else if (convertedAmount >= 100_000) {

        const val = (convertedAmount / 100_000).toFixed(1);
        return `${currency.symbol}${val.endsWith('.0') ? val.slice(0, -2) : val}L`;
      } else if (convertedAmount >= 1_000) {

        const val = (convertedAmount / 1_000).toFixed(1);
        return `${currency.symbol}${val.endsWith('.0') ? val.slice(0, -2) : val}K`;
      }
    }

    return `${currency.symbol}${convertedAmount.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    })}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};
