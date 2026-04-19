import { CurrencyCode, useCurrency } from "@/contexts/CurrencyContext";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";

/* Currency List */

const currencies: {
  code: CurrencyCode;
  label: string;
  flag: string;
}[] = [
  {
    code: "INR",
    label: "Indian Rupee",
    flag: "🇮🇳",
  },

  {
    code: "USD",
    label: "US Dollar",
    flag: "🇺🇸",
  },

  {
    code: "EUR",
    label: "Euro",
    flag: "🇪🇺",
  },

  {
    code: "GBP",
    label: "British Pound",
    flag: "🇬🇧",
  },
];

const CurrencySwitcher = () => {
  const { currency, setCurrency } = useCurrency();

  const [open, setOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  /* Memoized Current Currency */

  const current = useMemo(() => {
    return currencies.find((c) => c.code === currency);
  }, [currency]);

  /* Close on Outside Click */

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* Toggle Dropdown */

  const toggleDropdown = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  /* Change Currency */

  const handleCurrencyChange = useCallback(
    (code: CurrencyCode) => {
      setCurrency(code);

      setOpen(false);
    },

    [setCurrency]
  );

  if (!current) return null;

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger */}

      <button
        onClick={toggleDropdown}
        aria-label="Select currency"
        className="
        flex items-center gap-1.5
        rounded-full
        px-3 py-1.5
        text-sm font-medium
        bg-secondary
        text-secondary-foreground
        hover:bg-secondary/80
        transition-all
        active:scale-95
        "
      >
        <span>{current.flag}</span>

        <span>{current.code}</span>
      </button>

      {/* Dropdown */}

      {open && (
        <div
          className="
          absolute right-0
          top-full mt-2
          z-50
          w-48
          rounded-xl
          bg-card
          shadow-elevated
          border border-border
          overflow-hidden
          "
        >
          {currencies.map((c) => (
            <button
              key={c.code}
              onClick={() => handleCurrencyChange(c.code)}
              className={`
              w-full flex items-center gap-2
              px-4 py-2.5
              text-sm
              hover:bg-secondary
              transition-colors

              ${
                currency === c.code
                  ? "bg-primary/5 text-primary font-semibold"
                  : "text-foreground"
              }
              `}
            >
              <span>{c.flag}</span>

              <span>{c.label}</span>

              <span
                className="
                ml-auto
                text-xs
                text-muted-foreground
                "
              >
                {c.code}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CurrencySwitcher;
