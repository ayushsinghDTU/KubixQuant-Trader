// src/services/envConfig.js
export const API_CONFIG = {
  delta: {
    apiKey: import.meta.env.VITE_DELTA_API_KEY,
    apiSecret: import.meta.env.VITE_DELTA_API_SECRET,
    baseUrl: import.meta.env.VITE_DELTA_BASE_URL
  },
  coinranking: {
    apiKey: import.meta.env.VITE_RAPIDAPI_KEY,
    host: import.meta.env.VITE_RAPIDAPI_HOST,
    baseUrl: import.meta.env.VITE_COINRANKING_BASE_URL
  }
};
