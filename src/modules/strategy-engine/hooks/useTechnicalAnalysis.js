// src/hooks/useTechnicalAnalysis.js
import { useState, useEffect } from 'react';
import RapidAPIService from '../services/rapidApiService';

export const useTechnicalAnalysis = (symbol, indicators = ['RSI', 'MACD', 'SMA']) => {
  const [technicalData, setTechnicalData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTechnicalData = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = {};

        // Fetch RSI
        if (indicators.includes('RSI')) {
          const rsiData = await RapidAPIService.getTechnicalIndicator(symbol, 'RSI');
          data.rsi = rsiData['Technical Analysis: RSI'];
        }

        // Fetch MACD
        if (indicators.includes('MACD')) {
          const macdData = await RapidAPIService.getTechnicalIndicator(symbol, 'MACD');
          data.macd = macdData['Technical Analysis: MACD'];
        }

        // Fetch Simple Moving Average
        if (indicators.includes('SMA')) {
          const smaData = await RapidAPIService.getTechnicalIndicator(symbol, 'SMA', {
            time_period: 20
          });
          data.sma = smaData['Technical Analysis: SMA'];
        }

        setTechnicalData(data);
      } catch (err) {
        setError(err.message);
        console.error('Failed to fetch technical analysis data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (symbol) {
      fetchTechnicalData();
    }
  }, [symbol, indicators]);

  return { technicalData, loading, error };
};
