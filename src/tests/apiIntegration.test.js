// src/tests/apiIntegration.test.js
import RapidAPIService from '../services/rapidApiService';

describe('RapidAPI Integration', () => {
  test('should fetch stock quote successfully', async () => {
    const quote = await RapidAPIService.getStockQuote('AAPL');
    expect(quote).toHaveProperty('Global Quote');
    expect(quote['Global Quote']).toHaveProperty('01. symbol', 'AAPL');
  });

  test('should handle API errors gracefully', async () => {
    try {
      await RapidAPIService.getStockQuote('INVALID_SYMBOL');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});
