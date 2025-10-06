// src/services/positionService.js
import CryptoJS from 'crypto-js';

class PositionService {
  constructor() {
    this.baseURL = 'https://cdn-ind.testnet.deltaex.org';
    this.apiVersion = '/v2';
  }

  generateSignature(secret, message) {
    return CryptoJS.HmacSHA256(message, secret).toString();
  }

  // Get real positions from Delta Exchange
  async getRealPositions(apiKey, apiSecret) {
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
          'User-Agent': 'strategy-builder/1.0',
          'Content-Type': 'application/json'
        }
      });
      
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || 'Failed to fetch positions');
      }
      
      return this.formatPositions(result.result || []);
    } catch (error) {
      console.error('Error fetching real positions:', error);
      return []; // Return empty array if no positions or error
    }
  }

  // Get real orders from Delta Exchange
  async getRealOrders(apiKey, apiSecret) {
    try {
      const method = 'GET';
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const path = `${this.apiVersion}/orders`;
      const queryString = '?state=open';
      const payload = '';
      
      const signatureData = method + timestamp + path + queryString + payload;
      const signature = this.generateSignature(apiSecret, signatureData);
      
      const response = await fetch(`${this.baseURL}${path}${queryString}`, {
        method: 'GET',
        headers: {
          'api-key': apiKey,
          'timestamp': timestamp,
          'signature': signature,
          'User-Agent': 'strategy-builder/1.0',
          'Content-Type': 'application/json'
        }
      });
      
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || 'Failed to fetch orders');
      }
      
      return this.formatOrders(result.result || []);
    } catch (error) {
      console.error('Error fetching real orders:', error);
      return [];
    }
  }

  // Format positions data
  formatPositions(positions) {
    return positions.map(position => ({
      id: position.id,
      symbol: this.getSymbolFromProductId(position.product_id),
      side: position.size > 0 ? 'Long' : 'Short',
      size: Math.abs(position.size),
      entryPrice: parseFloat(position.entry_price || 0),
      markPrice: parseFloat(position.mark_price || 0),
      pnl: parseFloat(position.unrealized_pnl || 0),
      pnlPercent: this.calculatePnlPercent(position),
      margin: parseFloat(position.margin || 0),
      timestamp: new Date(position.created_at).getTime(),
      productId: position.product_id
    }));
  }

  // Format orders data
  formatOrders(orders) {
    return orders.map(order => ({
      id: order.id,
      symbol: this.getSymbolFromProductId(order.product_id),
      side: order.side,
      size: parseFloat(order.size),
      price: parseFloat(order.limit_price || order.stop_price || 0),
      type: order.order_type,
      status: order.state,
      timestamp: new Date(order.created_at).getTime(),
      filled: parseFloat(order.size) - parseFloat(order.unfilled_size || 0)
    }));
  }

  calculatePnlPercent(position) {
    if (!position.entry_price || !position.mark_price) return 0;
    
    const entryPrice = parseFloat(position.entry_price);
    const markPrice = parseFloat(position.mark_price);
    const size = parseFloat(position.size);
    
    if (size > 0) { // Long position
      return ((markPrice - entryPrice) / entryPrice) * 100;
    } else { // Short position
      return ((entryPrice - markPrice) / entryPrice) * 100;
    }
  }

  getSymbolFromProductId(productId) {
    const productMap = {
      27: 'BTCUSD',
      3136: 'ETHUSD',
      139: 'SOLUSD',
      78: 'ADAUSD',
      88: 'DOTUSD'
    };
    return productMap[productId] || `PRODUCT_${productId}`;
  }
}

export default new PositionService();
