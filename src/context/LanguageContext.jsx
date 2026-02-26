import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import en from '@/i18n/en';
import bn from '@/i18n/bn';

const LanguageContext = createContext(null);

const translations = { en, bn };

const CURRENCIES = {
    USD: { symbol: '$', code: 'USD', label: 'US Dollar', flag: '🇺🇸', locale: 'en-US' },
    BDT: { symbol: '৳', code: 'BDT', label: 'Bangladeshi Taka', flag: '🇧🇩', locale: 'en-IN' },
    EUR: { symbol: '€', code: 'EUR', label: 'Euro', flag: '🇪🇺', locale: 'de-DE' },
};

const CACHE_KEY = 'sg_exchange_rates';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour
const FALLBACK_RATES = { USD: 1, BDT: 121, EUR: 0.92 };

function getNestedValue(obj, path) {
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

export function LanguageProvider({ children }) {
    const [locale, setLocaleState] = useState(() => localStorage.getItem('sg_locale') || 'en');
    const [currency, setCurrencyState] = useState(() => localStorage.getItem('sg_currency') || 'USD');
    const [rates, setRates] = useState(() => {
        try {
            const cached = JSON.parse(localStorage.getItem(CACHE_KEY));
            if (cached && Date.now() - cached.timestamp < CACHE_DURATION) return cached.rates;
        } catch { }
        return FALLBACK_RATES;
    });

    // Fetch live exchange rates
    useEffect(() => {
        const fetchRates = async () => {
            try {
                const cached = JSON.parse(localStorage.getItem(CACHE_KEY));
                if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
                    setRates(cached.rates);
                    return;
                }
                const res = await fetch('https://open.er-api.com/v6/latest/USD');
                const data = await res.json();
                if (data?.rates) {
                    const newRates = {
                        USD: 1,
                        BDT: data.rates.BDT || FALLBACK_RATES.BDT,
                        EUR: data.rates.EUR || FALLBACK_RATES.EUR,
                    };
                    setRates(newRates);
                    localStorage.setItem(CACHE_KEY, JSON.stringify({ rates: newRates, timestamp: Date.now() }));
                }
            } catch {
                console.warn('Exchange rate fetch failed, using fallback rates');
            }
        };
        fetchRates();
    }, []);

    const setLocale = useCallback((newLocale) => {
        setLocaleState(newLocale);
        localStorage.setItem('sg_locale', newLocale);
    }, []);

    const setCurrency = useCallback((newCurrency) => {
        setCurrencyState(newCurrency);
        localStorage.setItem('sg_currency', newCurrency);
    }, []);

    // Translation function
    const t = useCallback((key) => {
        const value = getNestedValue(translations[locale], key);
        if (value !== undefined) return value;
        const fallback = getNestedValue(translations.en, key);
        return fallback !== undefined ? fallback : key;
    }, [locale]);

    // Currency formatter — converts USD to the selected currency
    const formatCurrency = useCallback((usdAmount) => {
        if (usdAmount == null || isNaN(usdAmount)) return `${CURRENCIES[currency].symbol}0`;
        const num = parseFloat(usdAmount);
        const converted = num * (rates[currency] || 1);
        const cur = CURRENCIES[currency];
        return `${cur.symbol}${converted.toLocaleString(cur.locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }, [currency, rates]);

    // Short currency (no decimals)
    const formatCurrencyShort = useCallback((usdAmount) => {
        if (usdAmount == null || isNaN(usdAmount)) return `${CURRENCIES[currency].symbol}0`;
        const num = parseFloat(usdAmount);
        const converted = num * (rates[currency] || 1);
        const cur = CURRENCIES[currency];
        return `${cur.symbol}${converted.toLocaleString(cur.locale, { maximumFractionDigits: 0 })}`;
    }, [currency, rates]);

    const currencySymbol = CURRENCIES[currency].symbol;
    const currencyInfo = CURRENCIES[currency];

    return (
        <LanguageContext.Provider value={{
            locale,
            setLocale,
            currency,
            setCurrency,
            currencyInfo,
            currencies: CURRENCIES,
            t,
            formatCurrency,
            formatCurrencyShort,
            currencySymbol,
            rates,
            isBangla: locale === 'bn',
        }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) throw new Error('useLanguage must be used within LanguageProvider');
    return context;
}
