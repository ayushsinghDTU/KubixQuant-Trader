// src/services/deltaExchangeService.js
import CryptoJS from 'crypto-js';

class DeltaExchangeService {
  constructor() {
    this.baseURL = 'https://api.india.delta.exchange';
    this.apiVersion = '/v2';
  }

  generateSignature(secret, message) {
    return CryptoJS.HmacSHA256(message, secret).toString();
  }

  async getOpenPositions(apiKey, apiSecret) {
    try {
      const method = 'GET';
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const path = `${this.apiVersion}/positions`;
      const queryString = '';
      const payload = '';

      const signatureData = method + timestamp + path + queryString + payload;
      const signature = this.generateSignature(apiSecret, signatureData);

      const response = await fetch(`${this.baseURL}${path}`, {
        method: 'GET',
        headers: {
          'api-key': apiKey,
          'timestamp': timestamp,
          'signature': signature,
          'User-Agent': 'rest-client',
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch positions');
      }

      return this.formatPositions(result.result || []);
    } catch (error) {
      console.error('Error fetching positions:', error);
      throw error;
    }
  }

  async closePosition(apiKey, apiSecret, productId, size, side) {
    try {
      const method = 'POST';
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const path = `${this.apiVersion}/orders`;
      const queryString = '';

      // Close position by placing opposite order
      const payload = JSON.stringify({
        product_id: productId,
        size: size,
        side: side === 'Long' ? 'sell' : 'buy', // Opposite side to close
        order_type: 'market_order',
        reduce_only: true,
        time_in_force: 'ioc'
      });

      const signatureData = method + timestamp + path + queryString + payload;
      const signature = this.generateSignature(apiSecret, signatureData);

      const response = await fetch(`${this.baseURL}${path}`, {
        method: 'POST',
        headers: {
          'api-key': apiKey,
          'timestamp': timestamp,
          'signature': signature,
          'User-Agent': 'rest-client',
          'Content-Type': 'application/json'
        },
        body: payload
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to close position');
      }

      return result.result;
    } catch (error) {
      console.error('Error closing position:', error);
      throw error;
    }
  }

  formatPositions(positions) {
    return positions
      .filter(pos => Math.abs(parseFloat(pos.size || 0)) > 0)
      .map(position => ({
        id: position.product_id,
        symbol: position.product_symbol || `Product-${position.product_id}`,
        side: parseFloat(position.size) > 0 ? 'Long' : 'Short',
        size: Math.abs(parseFloat(position.size)).toString(),
        entryPrice: parseFloat(position.entry_price || 0),
        currentPrice: parseFloat(position.mark_price || position.entry_price || 0),
        pnl: parseFloat(position.unrealized_pnl || 0),
        pnlPercent: parseFloat(position.unrealized_pnl_percentage || 0),
        margin: parseFloat(position.margin || 0),
        leverage: `${position.leverage || 1}x`,
        timestamp: new Date(position.created_at || Date.now()).getTime(),
        productId: position.product_id
      }));
  }
}

export default new DeltaExchangeService();
