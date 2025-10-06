import axios from 'axios';

// Create axios instances with retry logic
const createAxiosInstance = (config) => {
  const instance = axios.create(config);
  
  // Add request interceptor for error handling
  instance.interceptors.request.use(
    (config) => {
      // Add timestamp to prevent caching
      config.params = {
        ...config.params,
        _t: Date.now()
      };
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Add response interceptor for error handling
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const { config, response } = error;
      
      // Retry the request up to 3 times if it fails
      if (!config || !config.retry) {
        config.retry = 3;
      }
      
      if (config.retry > 0) {
        config.retry--;
        await new Promise(resolve => setTimeout(resolve, 1000));
        return instance(config);
      }
      
      return Promise.reject(error);
    }
  );

  return instance;
};

// Delta Exchange API
const deltaApi = createAxiosInstance({
  baseURL: import.meta.env.VITE_DELTA_BASE_URL || 'https://cdn-ind.testnet.deltaex.org/v2',
  headers: {
    'Content-Type': 'application/json',
    'api-key': import.meta.env.VITE_DELTA_API_KEY,
    'api-secret': import.meta.env.VITE_DELTA_API_SECRET
  },
  timeout: 5000
});

// Coinranking API
const coinrankingApi = createAxiosInstance({
  baseURL: import.meta.env.VITE_COINRANKING_BASE_URL || 'https://coinranking1.p.rapidapi.com',
  headers: {
    'Content-Type': 'application/json',
    'X-RapidAPI-Key': import.meta.env.VITE_RAPIDAPI_KEY,
    'X-RapidAPI-Host': import.meta.env.VITE_RAPIDAPI_HOST || 'coinranking1.p.rapidapi.com'
  },
  timeout: 5000
});

// Utility function to handle API errors
const handleApiError = (error, context) => {
  const errorMessage = error.response?.data?.message || error.message;
  console.error(`Error ${context}:`, errorMessage);
  throw new Error(`Failed to ${context}: ${errorMessage}`);
};

// Format number to standard format
const formatNumber = (number, decimals = 2) => {
  if (typeof number !== 'number') {
    number = parseFloat(number) || 0;
  }
  return parseFloat(number.toFixed(decimals));
};

export const fetchMarketData = async (symbol, timeframe = '1D') => {
  try {
    const params = {
      interval: timeframe === '1H' ? '5m' : 
                timeframe === '4H' ? '15m' : 
                timeframe === '1D' ? '1h' : 
                timeframe === '1W' ? '4h' : '1d',
      limit: 100
    };

    const response = await coinrankingApi.get(`/coins/${symbol}/history`, { params });
    
    if (!response.data?.data?.history) {
      throw new Error('Invalid market data response');
    }

    return response.data.data.history.map(point => ({
      timestamp: new Date(point.timestamp).getTime(),
      price: formatNumber(point.price),
      volume: formatNumber(point.volume)
    }));
  } catch (error) {
    handleApiError(error, 'fetching market data');
  }
};

export const fetchOrderBook = async (symbol) => {
  try {
    const response = await deltaApi.get(`/l2orderbook/${symbol}`);
    
    if (!response.data?.bids || !response.data?.asks) {
      throw new Error('Invalid order book response');
    }

    return {
      bids: response.data.bids.map(([price, amount]) => ({
        price: formatNumber(price),
        amount: formatNumber(amount, 4)
      })),
      asks: response.data.asks.map(([price, amount]) => ({
        price: formatNumber(price),
        amount: formatNumber(amount, 4)
      }))
    };
  } catch (error) {
    handleApiError(error, 'fetching order book');
  }
};

export const fetchTicker = async (symbol) => {
  try {
    const response = await deltaApi.get(`/ticker/${symbol}`);
    
    if (!response.data?.mark_price) {
      throw new Error('Invalid ticker response');
    }

    return {
      lastPrice: formatNumber(response.data.mark_price),
      volume24h: formatNumber(response.data.volume_24h),
      highPrice24h: formatNumber(response.data.high_price_24h),
      lowPrice24h: formatNumber(response.data.low_price_24h),
      priceChange24h: formatNumber(response.data.price_change_24h)
    };
  } catch (error) {
    handleApiError(error, 'fetching ticker');
  }
};

export const fetchWatchlist = async () => {
  try {
    const response = await coinrankingApi.get('/coins', {
      params: {
        limit: 10,
        orderBy: 'marketCap',
        orderDirection: 'desc'
      }
    });
    
    if (!response.data?.data?.coins) {
      throw new Error('Invalid watchlist response');
    }

    return response.data.data.coins.map(coin => ({
      symbol: coin.symbol,
      name: coin.name,
      price: formatNumber(coin.price),
      change: formatNumber(coin.change),
      volume: formatNumber(coin.volume),
      marketCap: formatNumber(coin.marketCap)
    }));
  } catch (error) {
    handleApiError(error, 'fetching watchlist');
  }
};