'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type CurrencyData = {
  symbol: string;
  code: string;
  rate: number; // Rate relative to USD (1 USD = X Currency)
};

const defaultCurrency: CurrencyData = {
  symbol: '$',
  code: 'USD',
  rate: 1,
};

// Mock exchange rates (1 USD to X)
const MOCK_EXCHANGE_RATES: Record<string, number> = {
  'USD': 1,
  'EUR': 0.92,
  'GBP': 0.79,
  'AED': 3.67,
  'INR': 83.1,
  'AUD': 1.52,
  'CAD': 1.35,
};

const COUNTRY_TO_CURRENCY: Record<string, { code: string; symbol: string }> = {
  'US': { code: 'USD', symbol: '$' },
  'GB': { code: 'GBP', symbol: '£' },
  'AE': { code: 'AED', symbol: 'د.إ' },
  'IN': { code: 'INR', symbol: '₹' },
  'AU': { code: 'AUD', symbol: 'A$' },
  'CA': { code: 'CAD', symbol: 'C$' },
  // Eurozone
  'FR': { code: 'EUR', symbol: '€' },
  'DE': { code: 'EUR', symbol: '€' },
  'IT': { code: 'EUR', symbol: '€' },
  'ES': { code: 'EUR', symbol: '€' },
  'NL': { code: 'EUR', symbol: '€' },
};

type CurrencyContextType = {
  currency: CurrencyData;
  formatPrice: (usdAmount: number, compact?: boolean) => string;
};

const CurrencyContext = createContext<CurrencyContextType>({
  currency: defaultCurrency,
  formatPrice: (amount) => `$${amount.toLocaleString()}`,
});

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrency] = useState<CurrencyData>(defaultCurrency);

  useEffect(() => {
    const fetchGeoIP = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        if (response.ok) {
          const data = await response.json();
          const countryCode = data.country_code;
          
          if (countryCode && COUNTRY_TO_CURRENCY[countryCode]) {
            const { code, symbol } = COUNTRY_TO_CURRENCY[countryCode];
            setCurrency({
              symbol,
              code,
              rate: MOCK_EXCHANGE_RATES[code] || 1,
            });
          }
        }
      } catch (error) {
        console.error('Error fetching Geo IP:', error);
      }
    };

    fetchGeoIP();
  }, []);

  const formatPrice = (usdAmount: number, compact: boolean = false) => {
    const convertedAmount = usdAmount * currency.rate;
    
    if (compact) {
      if (convertedAmount >= 1_000_000) {
        return `${currency.symbol}${(convertedAmount / 1_000_000).toFixed(1).replace(/\\.0$/, '')}M`;
      } else if (convertedAmount >= 1_000) {
        return `${currency.symbol}${(convertedAmount / 1_000).toFixed(0)}K`;
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
