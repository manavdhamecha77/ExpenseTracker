import { NextResponse } from 'next/server'

// Cache the countries data for 24 hours
let cachedCountries = null
let lastFetchTime = null
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

export async function GET() {
  try {
    // Check if we have cached data and it's still fresh
    const now = Date.now()
    if (cachedCountries && lastFetchTime && (now - lastFetchTime) < CACHE_DURATION) {
      return NextResponse.json(cachedCountries)
    }

    // Fetch fresh data from REST Countries API
    const response = await fetch('https://restcountries.com/v3.1/all?fields=name,currencies,cca2,flag', {
      headers: {
        'User-Agent': 'ExpenseApp/1.0'
      }
    })

    if (!response.ok) {
      throw new Error(`REST Countries API error: ${response.status}`)
    }

    const countriesData = await response.json()

    // Transform the data to a more usable format
    const countries = countriesData
      .filter(country => country.currencies && Object.keys(country.currencies).length > 0)
      .map(country => {
        // Get the first currency (most countries have only one)
        const currencyCode = Object.keys(country.currencies)[0]
        const currency = country.currencies[currencyCode]
        
        return {
          code: country.cca2, // 2-letter country code
          name: country.name.common,
          currency: currencyCode,
          currencyName: currency.name,
          currencySymbol: currency.symbol || currencyCode,
          flag: country.flag
        }
      })
      .sort((a, b) => a.name.localeCompare(b.name))

    // Cache the processed data
    cachedCountries = countries
    lastFetchTime = now

    return NextResponse.json(countries)

  } catch (error) {
    console.error('Error fetching countries:', error)
    return NextResponse.json(
      { error: 'Failed to fetch countries data' },
      { status: 500 }
    )
  }
}