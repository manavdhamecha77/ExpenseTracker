import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'

export function useCurrencies() {
  const [currencies, setCurrencies] = useState([])
  const [countries, setCountries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchCountriesAndCurrencies = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch('/api/countries')
        if (!response.ok) {
          throw new Error(`Failed to fetch countries: ${response.status}`)
        }
        
        const countriesData = await response.json()
        setCountries(countriesData)
        
        // Extract unique currencies
        const uniqueCurrencies = [...new Set(countriesData.map(country => country.currency))]
          .map(currencyCode => {
            const countryWithCurrency = countriesData.find(c => c.currency === currencyCode)
            return {
              code: currencyCode,
              name: countryWithCurrency.currencyName,
              symbol: countryWithCurrency.currencySymbol
            }
          })
          .sort((a, b) => a.code.localeCompare(b.code))
        
        setCurrencies(uniqueCurrencies)
      } catch (err) {
        console.error('Error fetching countries and currencies:', err)
        setError(err.message)
        toast({
          title: "Error",
          description: "Failed to load countries and currencies. Please refresh the page.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCountriesAndCurrencies()
  }, [])

  // Helper function to get currency by code
  const getCurrencyByCode = (code) => {
    return currencies.find(currency => currency.code === code)
  }

  // Helper function to get country by code
  const getCountryByCode = (code) => {
    return countries.find(country => country.code === code)
  }

  // Helper function to get countries by currency
  const getCountriesByCurrency = (currencyCode) => {
    return countries.filter(country => country.currency === currencyCode)
  }

  return {
    currencies,
    countries,
    loading,
    error,
    getCurrencyByCode,
    getCountryByCode,
    getCountriesByCurrency
  }
}

export function useExchangeRates(baseCurrency) {
  const [rates, setRates] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { toast } = useToast()

  useEffect(() => {
    if (!baseCurrency) return

    const fetchExchangeRates = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/exchange-rates/${baseCurrency}`)
        if (!response.ok) {
          throw new Error(`Failed to fetch exchange rates: ${response.status}`)
        }
        
        const ratesData = await response.json()
        setRates(ratesData)
      } catch (err) {
        console.error('Error fetching exchange rates:', err)
        setError(err.message)
        toast({
          title: "Error",
          description: `Failed to load exchange rates for ${baseCurrency}.`,
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchExchangeRates()
  }, [baseCurrency])

  // Helper function to convert amount
  const convertAmount = (amount, fromCurrency, toCurrency) => {
    if (!rates || !rates.rates) return null
    
    if (fromCurrency === toCurrency) return amount
    
    // If base currency is the from currency
    if (fromCurrency === rates.base) {
      const rate = rates.rates[toCurrency]
      return rate ? (amount * rate) : null
    }
    
    // If base currency is the to currency
    if (toCurrency === rates.base) {
      const rate = rates.rates[fromCurrency]
      return rate ? (amount / rate) : null
    }
    
    // Convert through base currency
    const fromRate = rates.rates[fromCurrency]
    const toRate = rates.rates[toCurrency]
    
    if (!fromRate || !toRate) return null
    
    // Convert from -> base -> to
    const baseAmount = amount / fromRate
    return baseAmount * toRate
  }

  return {
    rates,
    loading,
    error,
    convertAmount
  }
}