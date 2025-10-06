// src/services/rapidApiService.js
const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
const RAPIDAPI_HOST = import.meta.env.VITE_RAPIDAPI_HOST;
const BASE_URL = import.meta.env.VITE_RAPIDAPI_BASE_URL;

class RapidAPIService {
  constructor() {
    this.headers = {
      'X-RapidAPI-Key': RAPIDAPI_KEY,
      'X-RapidAPI-Host': RAPIDAPI_HOST,
      'Content-Type': 'application/json'
    };
  }

  async makeRequest(endpoint, params = {}) {
    try {
      const url = new URL(endpoint, BASE_URL);
      Object.keys(params).forEach(key => 
        url.searchParams.append(key, params[key])
      );

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: this.headers
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('RapidAPI request failed:', error);
      throw error;
    }
  }

  // Get real-time stock quotes
  async getStockQuote(symbol) {
    return this.makeRequest('/query', {
      function: 'GLOBAL_QUOTE',
      symbol: symbol,
      datatype: 'json'
    });
  }

  // Get historical data
  async getHistoricalData(symbol, interval = 'daily') {
    return this.makeRequest('/query', {
      function: 'TIME_SERIES_DAILY',
      symbol: symbol,
      outputsize: 'compact',
      datatype: 'json'
    });
  }

  // Get technical indicators
  async getTechnicalIndicator(symbol, indicator, params = {}) {
    return this.makeRequest('/query', {
      function: indicator,
      symbol: symbol,
      interval: '1min',
      time_period: 14,
      series_type: 'close',
      datatype: 'json',
      ...params
    });
  }

  // Get market news
  async getMarketNews(category = 'general') {
    return this.makeRequest('/query', {
      function: 'NEWS_SENTIMENT',
      tickers: 'AAPL,GOOGL,MSFT',
      limit: 50
    });
  }

  // Get cryptocurrency data
  async getCryptoData(symbol = 'BTC', market = 'USD') {
    return this.makeRequest('/query', {
      function: 'DIGITAL_CURRENCY_DAILY',
      symbol: symbol,
      market: market
    });
  }
}

export default new RapidAPIService();
