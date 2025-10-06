// src/modules/strategy-engine/services/zerodhaService.js
import CryptoJS from 'crypto-js';

const DEMO_BASE_URL = 'https://cdn-ind.testnet.deltaex.org';
const API_VERSION = '/v2';

const generateSignature = (secret, message) => {
  return CryptoJS.HmacSHA256(message, secret).toString();
};

// Global variable to store fetched products
let availableProducts = [];

const executeTradeReal = async (formData) => {
  console.log('🚀 Delta Exchange Demo - Starting trade execution...');
  console.log('📋 Form data received:', formData);
  
  if (!formData.apiKey || !formData.apiSecret) {
    throw new Error('Delta Exchange API Key and Secret are required');
  }
  
  try {
    // STEP 1: Get real available products first
    console.log('🔍 Fetching available products...');
    const products = await fetchAvailableProducts(formData.apiKey, formData.apiSecret);
    
    if (!products || products.length === 0) {
      throw new Error('No products available in demo environment');
    }
    
    // STEP 2: Find a valid product (prefer BTCUSD, fallback to first available)
    let targetProduct = products.find(p => p.symbol === 'BTCUSD' || p.symbol === 'BTC-USD');
    if (!targetProduct) {
      targetProduct = products[0]; // Use first available product
      console.warn('⚠️ BTCUSD not found, using first available product:', targetProduct);
    }
    
    console.log('✅ Using product:', targetProduct);
    
    const productId = targetProduct.id;
    const size = parseInt(formData.size) || 1;
    
    // STEP 3: Place order with verified product
    const method = 'POST';
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const path = `${API_VERSION}/orders`;
    const queryString = '';
    
    const orderPayload = {
      product_id: productId,
      size: size,
      side: formData.side || 'buy',
      order_type: formData.order_type || 'market_order',
      time_in_force: 'ioc',
      post_only: false,
      reduce_only: false,
      bracket_order: false,
      client_order_id: `api_${Date.now()}`
    };
    
    console.log('📦 Order payload with verified product:', orderPayload);
    
    const payload = JSON.stringify(orderPayload);
    const signatureData = method + timestamp + path + queryString + payload;
    const signature = generateSignature(formData.apiSecret, signatureData);
    
    const fullUrl = `${DEMO_BASE_URL}${path}`;
    
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'api-key': formData.apiKey,
        'timestamp': timestamp,
        'signature': signature,
        'User-Agent': 'strategy-builder/1.0',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: payload
    });
    
    console.log('📡 Response status:', response.status);
    
    const responseText = await response.text();
    console.log('📄 Raw response:', responseText);
    
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      throw new Error(`Invalid response: ${responseText}`);
    }
    
    if (!response.ok) {
      console.error('❌ API Error:', result);
      
      if (result.error) {
        const errorCode = result.error.code || result.error;
        const errorMessage = result.error.message || result.message;
        
        throw new Error(`${errorMessage || errorCode}`);
      } else {
        throw new Error(`HTTP ${response.status}: ${responseText}`);
      }
    }
    
    if (!result.success) {
      throw new Error(result.message || 'Order placement failed');
    }
    
    const orderResult = result.result;
    console.log('🎉 Order placed successfully!', orderResult);
    return orderResult.id || `SUCCESS_${Date.now()}`;
    
  } catch (error) {
    console.error('❌ Trade execution error:', error);
    throw error;
  }
};

// Fetch available products
const fetchAvailableProducts = async (apiKey, apiSecret) => {
  try {
    const method = 'GET';
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const path = `${API_VERSION}/products`;
    const queryString = '';
    const payload = '';
    
    const signatureData = method + timestamp + path + queryString + payload;
    const signature = generateSignature(apiSecret, signatureData);
    
    const response = await fetch(`${DEMO_BASE_URL}${path}`, {
      method: 'GET',
      headers: {
        'api-key': apiKey,
        'timestamp': timestamp,
        'signature': signature,
        'User-Agent': 'product-fetch/1.0',
        'Content-Type': 'application/json'
      }
    });
    
    const result = await response.json();
    
    if (response.ok && result.success) {
      availableProducts = result.result || [];
      console.log('📦 Available products:', availableProducts.map(p => `${p.symbol}(${p.id})`));
      return availableProducts;
    } else {
      throw new Error('Failed to fetch products');
    }
  } catch (error) {
    console.error('❌ Product fetch failed:', error);
    return [];
  }
};

// Enhanced connection test that shows real products
export const testDeltaConnection = async (apiKey, apiSecret) => {
  console.log('🧪 Testing connection and fetching products...');
  
  try {
    const products = await fetchAvailableProducts(apiKey, apiSecret);
    
    if (products && products.length > 0) {
      const productList = products.slice(0, 5).map(p => `${p.symbol}(ID:${p.id})`).join(', ');
      return {
        success: true,
        message: `✅ Connection successful! Found ${products.length} products. Available: ${productList}`,
        data: { products }
      };
    } else {
      return {
        success: false,
        message: '❌ No products found in demo environment',
        data: null
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `❌ Connection error: ${error.message}`,
      data: null
    };
  }
};

export const executeTrade = executeTradeReal;

export const validateZerodhaCredentials = (apiKey, apiSecret) => {
  return apiKey && apiSecret && apiKey.length > 10 && apiSecret.length > 10;
};

export const formatTradingSymbol = (symbol) => {
  if (!symbol) return '';
  return symbol.toUpperCase().replace(/[^A-Z0-9]/g, '');
};

// Updated to return dynamic products
export const getDeltaProducts = () => {
  if (availableProducts.length > 0) {
    return availableProducts.slice(0, 10).map(p => ({
      product_id: p.id,
      symbol: p.symbol,
      name: `${p.symbol} ${p.product_type || 'Perpetual'}`,
      verified: true
    }));
  }
  
  // Fallback
  return [
    { product_id: 27, symbol: 'BTCUSD', name: 'Bitcoin Perpetual', verified: false }
  ];
};
