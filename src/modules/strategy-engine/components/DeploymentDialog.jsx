// src/modules/strategy-engine/components/DeploymentDialog.jsx
import React, { useState, useEffect } from 'react';
import { X, TrendingUp, Target, DollarSign, AlertTriangle, CheckCircle, ExternalLink, Wifi } from 'lucide-react';
import { testDeltaConnection } from '../../../modules/strategy-engine/services/zerodhaService';

const DeploymentDialog = ({ 
  strategy, 
  isOpen, 
  onClose, 
  formData, 
  onInputChange, 
  onSubmit 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      // Auto-set Bitcoin and size 1 (matching your successful manual order)
      if (!formData.product_id) {
        onInputChange({ target: { name: 'product_id', value: '27' } });
      }
      if (!formData.size) {
        onInputChange({ target: { name: 'size', value: '1' } });
      }
    } else {
      setIsAnimating(false);
    }
  }, [isOpen]);

  if (!isOpen && !isAnimating) return null;

  // FIXED: Only Bitcoin (verified working in manual trading)
  const deltaProducts = {
    crypto: [
      { symbol: 'BTCUSD', name: 'Bitcoin Perpetual (Verified Working)', product_id: 27 }
    ]
  };

  const getRecommendedSettings = () => {
    const riskLevel = strategy?.risk?.toLowerCase();
    
    switch (riskLevel) {
      case 'low':
        return { recommendedSize: '1', recommendedCapital: '$100' };
      case 'medium':
        return { recommendedSize: '1-2', recommendedCapital: '$200' };
      case 'high':
        return { recommendedSize: '2-3', recommendedCapital: '$300' };
      default:
        return { recommendedSize: '1', recommendedCapital: '$100' };
    }
  };

  const testConnection = async () => {
    if (!formData.apiKey || !formData.apiSecret) {
      alert('Please enter API Key and Secret first');
      return;
    }

    setIsTestingConnection(true);
    setConnectionStatus(null);

    try {
      const result = await testDeltaConnection(formData.apiKey, formData.apiSecret);
      setConnectionStatus(result);
    } catch (error) {
      setConnectionStatus({ 
        success: false, 
        message: `Connection test failed: ${error.message}` 
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const recommendations = getRecommendedSettings();

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black transition-all duration-500 z-40 ${
          isOpen 
            ? 'bg-opacity-60 backdrop-blur-sm' 
            : 'bg-opacity-0 backdrop-blur-none'
        }`}
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none">
        <div 
          className={`
            bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto
            transform transition-all duration-500 ease-out pointer-events-auto
            ${isOpen 
              ? 'scale-100 rotate-0 translate-y-0 opacity-100' 
              : 'scale-75 rotate-3 translate-y-8 opacity-0'
            }
          `}
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-t-2xl p-6 text-white overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
            <div className="relative flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Deploy to Delta Exchange Demo</h3>
                  <p className="text-blue-100 font-medium">{strategy?.name}</p>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Strategy Overview */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 text-lg">{strategy?.name}</h4>
                  <p className="text-gray-600 mt-1">{strategy?.description}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  strategy?.risk === 'Low' ? 'bg-green-100 text-green-800' :
                  strategy?.risk === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {strategy?.risk} Risk
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{strategy?.performance}</p>
                  <p className="text-sm text-gray-600">Performance</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{strategy?.accuracy}</p>
                  <p className="text-sm text-gray-600">Accuracy</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{strategy?.signals?.buy + strategy?.signals?.sell}</p>
                  <p className="text-sm text-gray-600">Total Signals</p>
                </div>
              </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
              {/* API Warning */}
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-amber-800">Delta Exchange Demo Required</h5>
                    <p className="text-sm text-amber-700 mt-1">
                      Must have Trading permission enabled + IP whitelisted
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <ExternalLink className="w-4 h-4 text-amber-600" />
                      <a 
                        href="https://demo.delta.exchange/app/account/manageapikeys" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-amber-700 hover:text-amber-900 underline"
                      >
                        Get Demo API Keys (Trading Permission + IP Whitelist Required)
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* API Credentials */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Delta Demo API Key *
                    </label>
                    <input
                      type="password"
                      name="apiKey"
                      value={formData.apiKey || ''}
                      onChange={onInputChange}
                      placeholder="Your Delta Exchange Demo API Key"
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      API Secret *
                    </label>
                    <input
                      type="password"
                      name="apiSecret"
                      value={formData.apiSecret || ''}
                      onChange={onInputChange}
                      placeholder="Your API Secret"
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Test Connection */}
                <div className="flex space-x-4 items-center">
                  <button
                    type="button"
                    onClick={testConnection}
                    disabled={isTestingConnection || !formData.apiKey || !formData.apiSecret}
                    className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    <Wifi className="w-4 h-4" />
                    <span>{isTestingConnection ? 'Testing...' : 'Test Connection'}</span>
                  </button>
                  
                  {connectionStatus && (
                    <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                      connectionStatus.success 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      <span className="text-sm font-medium">
                        {connectionStatus.success ? '✅' : '❌'} {connectionStatus.message}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Product Selection - Fixed to Bitcoin only */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Target className="w-4 h-4 inline mr-2" />
                  Crypto Product * (Matching Manual Order Success)
                </label>
                <select
                  name="product_id"
                  value={formData.product_id || '27'}
                  onChange={onInputChange}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="">Choose Product</option>
                  {deltaProducts.crypto.map(product => (
                    <option key={product.product_id} value={product.product_id}>
                      {product.name} ({product.symbol})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-green-600 mt-1">✅ Bitcoin verified working in your manual orders</p>
              </div>

              {/* Trading Parameters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Contract Size * (Matching Manual Order)
                  </label>
                  <input
                    type="number"
                    name="size"
                    value={formData.size || '1'}
                    onChange={onInputChange}
                    placeholder="1 lot (same as manual order)"
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                    min="1"
                    max="5"
                  />
                  <p className="text-xs text-green-600 mt-1">✅ Size 1 worked in manual order</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Order Type
                  </label>
                  <select
                    name="order_type"
                    value={formData.order_type || 'market_order'}
                    onChange={onInputChange}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="market_order">Market Order (Used in Manual)</option>
                    <option value="limit_order">Limit Order</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Side
                  </label>
                  <select
                    name="side"
                    value={formData.side || 'buy'}
                    onChange={onInputChange}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="buy">Buy (Long) - Used in Manual</option>
                    <option value="sell">Sell (Short)</option>
                  </select>
                </div>
              </div>

              {/* Checklist */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h6 className="font-semibold text-gray-700 mb-3">✅ Pre-deployment Checklist:</h6>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className={formData.apiKey ? '✅' : '❌'}></span>
                    <span>API Key entered</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={formData.apiSecret ? '✅' : '❌'}></span>
                    <span>API Secret entered</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={connectionStatus?.success ? '✅' : '⚠️'}></span>
                    <span>Connection {connectionStatus?.success ? 'verified' : 'needs testing'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={formData.product_id === '27' ? '✅' : '❌'}></span>
                    <span>Bitcoin selected (matches manual)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={formData.size === '1' ? '✅' : '⚠️'}></span>
                    <span>Size 1 (matches manual order)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={formData.order_type === 'market_order' ? '✅' : '⚠️'}></span>
                    <span>Market order (matches manual)</span>
                  </div>
                </div>
              </div>

              {/* Deploy Button */}
              <div className="flex space-x-4 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={!connectionStatus?.success}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center space-x-2 disabled:transform-none"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>Deploy API Order (Match Manual Success)</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeploymentDialog;
