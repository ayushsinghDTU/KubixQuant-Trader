// src/services/coinrankingService.js
import axios from 'axios';

class CoinrankingService {
  constructor() {
    this.apiKey = '3472b70274msh4c7c43440543514p158257jsne5e91faa2c27';
    this.apiHost = 'coinranking1.p.rapidapi.com';
    this.baseURL = 'https://coinranking1.p.rapidapi.com';
    
    this.headers = {
      'x-rapidapi-key': this.apiKey,
      'x-rapidapi-host': this.apiHost,
      'Content-Type': 'application/json'
    };
  }

  async getGlobalStats() {
    try {
      const response = await axios.get(`${this.baseURL}/stats`, {
        headers: this.headers,
        params: {
          referenceCurrencyUuid: 'yhjMzLPhuIDl'
        }
      });
      
      return response.data.data;
    } catch (error) {
      console.error('Stats fetch error:', error);
      throw this.handleError(error);
    }
  }

  async getTopCoins(limit = 10) {
    try {
      const response = await axios.get(`${this.baseURL}/coins`, {
        headers: this.headers,
        params: {
          referenceCurrencyUuid: 'yhjMzLPhuIDl',
          timePeriod: '24h',
          'tiers[0]': '1',
          orderBy: 'marketCap',
          orderDirection: 'desc',
          limit: limit,
          offset: 0
        }
      });
      
      return response.data.data;
    } catch (error) {
      console.error('Coins fetch error:', error);
      throw this.handleError(error);
    }
  }

  async getCoinHistory(coinId, timePeriod = '24h') {
    try {
      const response = await axios.get(`${this.baseURL}/coin/${coinId}/history`, {
        headers: this.headers,
        params: {
          referenceCurrencyUuid: 'yhjMzLPhuIDl',
          timePeriod: timePeriod
        }
      });
      
      return response.data.data;
    } catch (error) {
      console.error('History fetch error:', error);
      throw this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      const { status } = error.response;
      switch (status) {
        case 401:
          return new Error('Authentication failed');
        case 403:
          return new Error('Access denied');
        case 429:
          return new Error('Rate limit exceeded');
        default:
          return new Error('Service temporarily unavailable');
      }
    }
    return new Error('Connection error');
  }

  formatPrice(price) {
    const numPrice = parseFloat(price);
    if (numPrice >= 1) {
      return `$${numPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      return `$${numPrice.toFixed(6)}`;
    }
  }

  formatMarketCap(marketCap) {
    const num = parseFloat(marketCap);
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
  }

  formatChange(change) {
    const num = parseFloat(change);
    return `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`;
  }
}

export default new CoinrankingService();
