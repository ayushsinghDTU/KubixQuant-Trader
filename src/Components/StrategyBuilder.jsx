// src/Components/StrategyBuilder.jsx
import React, { useState } from 'react';
import { Play, Pause, BarChart3, ArrowUpCircle, ArrowDownCircle, Plus, Filter, Target, Trash2 } from 'lucide-react';
import { DeploymentDialog, useDeployment, executeTrade } from '../modules/strategy-engine';
import { StrategyTypeSelector } from '../modules/strategy-engine/components/StrategyTypeSelector';
import { StandardStrategiesModal } from '../modules/strategy-engine/components/StandardStrategiesModal';

const StrategyBuilder = () => {
  const [strategies, setStrategies] = useState([
    {  
      id: 1,
      name: "Moving Average Crossover",
      description: "Buy when fast MA crosses above slow MA, sell when it crosses below",
      performance: "+18.5%",
      accuracy: "72%",
      status: "active",
      signals: { buy: 15, sell: 12 },
      risk: "Medium",
      category: "Trend Following",
      tradingType: "stock",
      source: "Classic Technical Analysis"
    },
    {
      id: 2,
      name: "RSI Scalping",
      description: "Quick scalp trades based on RSI divergence patterns",
      performance: "+28.3%",
      accuracy: "78%",
      status: "active",
      signals: { buy: 45, sell: 42 },
      risk: "High",
      category: "Scalping",
      tradingType: "stock",
      source: "Day Trading Strategies"
    },
    {
      id: 3,
      name: "Nifty Breakout",
      description: "Index breakout trading with volume confirmation",
      performance: "+15.7%",
      accuracy: "68%",
      status: "inactive",
      signals: { buy: 12, sell: 10 },
      risk: "Medium",
      category: "Breakout",
      tradingType: "index",
      source: "Index Trading Guide"
    }
  ]);

  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [showStandardStrategies, setShowStandardStrategies] = useState(false);
  const [selectedTradingType, setSelectedTradingType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredType, setFilteredType] = useState('all');

  const {
    selectedStrategy,
    isDialogOpen,
    formData,
    handleDeployClick,
    handleInputChange,
    handleCloseDialog
  } = useDeployment();

  const handleStartCreation = () => {
    setShowTypeSelector(true);
  };

  const handleTypeSelection = (tradingType, category) => {
    console.log('Handling type selection:', { tradingType, category });
    
    // Ensure we have valid data
    if (!tradingType || !category) {
      console.error('Invalid selection data');
      alert('Please select both trading type and category');
      return;
    }
    
    setSelectedTradingType(tradingType);
    setSelectedCategory(category);
    setShowTypeSelector(false);
    
    // Small delay to ensure state updates
    setTimeout(() => {
      setShowStandardStrategies(true);
    }, 100);
  };

  const handleCreateCustomStrategy = () => {
    // This would open your existing CreateStrategyModal
    setShowStandardStrategies(false);
    // Add logic to open custom strategy creation
  };

  const handleSelectStandardStrategy = (strategy) => {
    const newStrategy = {
      ...strategy,
      id: Date.now(), // Use timestamp for unique ID
      status: "inactive",
      signals: { buy: 0, sell: 0 },
      performance: "0%",
      accuracy: "0%",
      tradingType: selectedTradingType,
      category: selectedCategory
    };
    
    setStrategies([...strategies, newStrategy]);
    setShowStandardStrategies(false);
    
    // Enhanced success message with more details
    const successMessage = `
🎉 Strategy Created Successfully!

✅ "${strategy.name}" has been added to your strategy portfolio
📊 Category: ${selectedCategory}
🎯 Trading Type: ${selectedTradingType}
📚 Source: ${strategy.source}
⚠️  Risk Level: ${strategy.risk}

You can now find it in your strategy list and deploy it when ready!
    `;
    
    alert(successMessage);
  };

  // Delete Strategy Function
  const handleDeleteStrategy = (strategyId, strategyName) => {
    const confirmDelete = window.confirm(
      `⚠️ Delete Strategy?\n\nAre you sure you want to delete "${strategyName}"?\n\nThis action cannot be undone.`
    );
    
    if (confirmDelete) {
      setStrategies(prevStrategies => 
        prevStrategies.filter(strategy => strategy.id !== strategyId)
      );
      
      // Show success message
      alert(`✅ Strategy Deleted Successfully!\n\n"${strategyName}" has been removed from your portfolio.`);
    }
  };

  // src/Components/StrategyBuilder.jsx
// Update this function in your StrategyBuilder component:

const handleSubmit = async (e) => {
  e.preventDefault();
  console.log('📋 Submitting deployment form:', formData);
  
  try {
    // Add strategy context to form data
    const enhancedFormData = {
      ...formData,
      strategyName: selectedStrategy.name,
      risk: selectedStrategy.risk,
      strategyId: selectedStrategy.id
    };
    
    console.log('🚀 Enhanced form data:', enhancedFormData);
    
    const orderId = await executeTrade(enhancedFormData);
    
    // Enhanced success message
    const successMessage = `
🎉 Strategy Deployed Successfully!

✅ Strategy: ${selectedStrategy.name}
🆔 Order ID: ${orderId}
🏢 Exchange: Delta Exchange (Demo)
📊 Product: ${getDeltaProductName(formData.product_id)}
📈 Size: ${formData.size} contracts
💱 Side: ${formData.side || 'buy'}

Your strategy is now active in demo mode!
    `;
    
    alert(successMessage);
    handleCloseDialog();
    
  } catch (error) {
    console.error('❌ Deployment error:', error);
    
    // Enhanced error message
    const errorMessage = `
❌ Deployment Failed

Strategy: ${selectedStrategy.name}
Error: ${error.message}

Please check:
✓ API credentials are correct
✓ All required fields are filled
✓ Internet connection is stable

Try again or contact support if the issue persists.
    `;
    
    alert(errorMessage);
  }
};

// Helper function to get product name
const getDeltaProductName = (productId) => {
  const products = {
    27: 'Bitcoin Perpetual (BTCUSD)',
    3136: 'Ethereum Perpetual (ETHUSD)',
    139: 'Solana Perpetual (SOLUSD)',
    78: 'Cardano Perpetual (ADAUSD)',
    88: 'Polkadot Perpetual (DOTUSD)'
  };
  return products[productId] || 'Unknown Product';
};

  const getFilteredStrategies = () => {
    if (filteredType === 'all') return strategies;
    return strategies.filter(strategy => strategy.tradingType === filteredType);
  };

  const getStatusIcon = (status) => {
    return status === 'active' ? <Play className="w-4 h-4 text-green-500" /> : <Pause className="w-4 h-4 text-gray-500" />;
  };

  const getRiskColor = (risk) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTradingTypeColor = (type) => {
    switch (type) {
      case 'stock': return 'text-blue-600 bg-blue-100';
      case 'index': return 'text-purple-600 bg-purple-100';
      case 'futures': return 'text-green-600 bg-green-100';
      case 'options': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Strategy Builder</h1>
            <p className="text-blue-100">Choose your trading type and discover strategies</p>
          </div>
          <button 
            onClick={handleStartCreation}
            className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Create Strategy</span>
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-700">Filter by Trading Type:</span>
            <div className="flex space-x-2">
              {['all', 'stock', 'index', 'futures', 'options'].map(type => (
                <button
                  key={type}
                  onClick={() => setFilteredType(type)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    filteredType === type 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <BarChart3 className="w-8 h-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Strategies</p>
              <p className="text-2xl font-bold">{getFilteredStrategies().length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <ArrowUpCircle className="w-8 h-8 text-green-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Active Strategies</p>
              <p className="text-2xl font-bold">
                {getFilteredStrategies().filter(s => s.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <Target className="w-8 h-8 text-purple-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Stock Strategies</p>
              <p className="text-2xl font-bold">
                {strategies.filter(s => s.tradingType === 'stock').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <ArrowDownCircle className="w-8 h-8 text-orange-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Index Strategies</p>
              <p className="text-2xl font-bold">
                {strategies.filter(s => s.tradingType === 'index').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Strategies Table with Delete Functionality */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Strategy
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trading Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {getFilteredStrategies().map((strategy) => (
                <tr key={strategy.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <div className="text-sm font-medium text-gray-900 truncate">{strategy.name}</div>
                      <div className="text-sm text-gray-500 truncate">{strategy.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTradingTypeColor(strategy.tradingType)}`}>
                      {strategy.tradingType?.charAt(0).toUpperCase() + strategy.tradingType?.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{strategy.category}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-green-600">{strategy.performance}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskColor(strategy.risk)}`}>
                      {strategy.risk}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(strategy.status)}
                      <span className="ml-2 text-sm text-gray-900 capitalize">{strategy.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleDeployClick(strategy)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        Deploy
                      </button>
                      <button 
                        onClick={() => handleDeleteStrategy(strategy.id, strategy.name)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1"
                        title="Delete Strategy"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <StrategyTypeSelector
        isOpen={showTypeSelector}
        onClose={() => setShowTypeSelector(false)}
        onSelect={handleTypeSelection}
      />

      <StandardStrategiesModal
        isOpen={showStandardStrategies}
        onClose={() => setShowStandardStrategies(false)}
        tradingType={selectedTradingType}
        category={selectedCategory}
        onSelectStrategy={handleSelectStandardStrategy}
        onCreateCustom={handleCreateCustomStrategy}
      />

      <DeploymentDialog
        strategy={selectedStrategy}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        formData={formData}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default StrategyBuilder;
