import {
  ReactNode,
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";

export type CurrencyCode = "INR" | "USD" | "EUR" | "GBP";

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  format: (amountInINR: number) => string;
  symbol: string;
}

const rates: Record<CurrencyCode, number> = {
  INR: 1,
  USD: 0.012,
  EUR: 0.011,
  GBP: 0.0095,
};

const symbols: Record<CurrencyCode, string> = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

const CurrencyContext = createContext<CurrencyContextType>(
  {} as CurrencyContextType
);

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    try {
      const stored = localStorage.getItem(
        "travelista_currency"
      ) as CurrencyCode;

      return stored || "INR";
    } catch {
      return "INR";
    }
  });

  const setCurrency = useCallback((c: CurrencyCode) => {
    setCurrencyState(c);

    try {
      localStorage.setItem("travelista_currency", c);
    } catch (error) {
      console.error("Currency storage error:", error);
    }
  }, []);

  const symbol = useMemo(() => {
    return symbols[currency];
  }, [currency]);

  const format = useCallback(
    (amountInINR: number) => {
      const converted = amountInINR * rates[currency];

      if (currency === "INR") {
        return `₹${converted.toLocaleString("en-IN", {
          maximumFractionDigits: 0,
        })}`;
      }

      return `${symbols[currency]}${converted.toLocaleString("en-US", {
        minimumFractionDigits: 0,

        maximumFractionDigits: 0,
      })}`;
    },
    [currency]
  );

  const value = useMemo(() => {
    return {
      currency,
      setCurrency,
      format,
      symbol,
    };
  }, [currency, setCurrency, format, symbol]);

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};
