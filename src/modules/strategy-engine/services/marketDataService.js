// src/services/marketDataService.js
const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
const RAPIDAPI_HOST = import.meta.env.VITE_RAPIDAPI_HOST;
const BASE_URL = import.meta.env.VITE_COINRANKING_BASE_URL;

class MarketDataService {
  constructor() {
    // Use environment variables directly
    this.apiKey = RAPIDAPI_KEY;
    this.apiHost = RAPIDAPI_HOST;
    this.baseURL = BASE_URL;
    
    console.log('🔑 API Key loaded:', this.apiKey ? 'Yes' : 'No');
    console.log('🌐 API Host:', this.apiHost);
    
    this.headers = {
      'x-rapidapi-key': this.apiKey,
      'x-rapidapi-host': this.apiHost,
      'Content-Type': 'application/json'
    };
  }

  async getMarketData() {
    try {
      const response = await fetch(`${this.baseURL}/coins`, {
        headers: this.headers,
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      return this.formatMarketData(data);
    } catch (error) {
      console.error('Market data fetch error:', error);
      return this.getFallbackData();
    }
  }

  formatMarketData(data) {
    return data.data.coins.map(coin => ({
      symbol: coin.symbol,
      name: coin.name,
      price: parseFloat(coin.price),
      change: parseFloat(coin.change),
      marketCap: coin.marketCap,
      rank: coin.rank,
      iconUrl: coin.iconUrl
    }));
  }

  getFallbackData() {
    return [
      { symbol: 'BTC', name: 'Bitcoin', price: 45000, change: 2.5, rank: 1 },
      { symbol: 'ETH', name: 'Ethereum', price: 2800, change: -1.2, rank: 2 },
      { symbol: 'SOL', name: 'Solana', price: 98, change: 4.1, rank: 3 }
    ];
  }
}

export default new MarketDataService();
