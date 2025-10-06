// src/modules/strategy-engine/components/StrategyTypeSelector.jsx
import React, { useState } from 'react';
import { X, TrendingUp, BarChart3, Zap, Target } from 'lucide-react';

export const StrategyTypeSelector = ({ isOpen, onClose, onSelect }) => {
  const [selectedType, setSelectedType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const tradingTypes = [
    {
      id: 'stock',
      name: 'Stock Trading',
      icon: TrendingUp,
      description: 'Individual stock trading strategies',
      categories: ['Scalping', 'Swing Trading', 'Position Trading', 'Value Investing']
    },
    {
      id: 'index',
      name: 'Index Trading',
      icon: BarChart3,
      description: 'Trade market indices like Nifty, Sensex',
      categories: ['Trend Following', 'Breakout', 'Mean Reversion', 'Momentum']
    },
    {
      id: 'futures',
      name: 'Futures Trading',
      icon: Zap,
      description: 'Futures and derivatives trading',
      categories: ['Spread Trading', 'Calendar Spreads', 'Arbitrage', 'Hedging']
    },
    {
      id: 'options',
      name: 'Options Trading',
      icon: Target,
      description: 'Options strategies and combinations',
      categories: ['Iron Condor', 'Straddle', 'Covered Call', 'Bull Call Spread']
    }
  ];

  const handleTypeSelect = (typeId) => {
    setSelectedType(typeId);
    setSelectedCategory('');
  };

  const handleContinue = () => {
    if (selectedType && selectedCategory) {
      onSelect(selectedType, selectedCategory);
    }
  };

  if (!isOpen) return null;

  const selectedTypeData = tradingTypes.find(type => type.id === selectedType);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-t-2xl p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold">Choose Your Trading Style</h3>
              <p className="text-green-100">Select the type of trading you want to focus on</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {/* Step 1: Trading Type Selection */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Step 1: Select Trading Type</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tradingTypes.map((type) => (
                  <div
                    key={type.id}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      selectedType === type.id
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                    onClick={() => handleTypeSelect(type.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <type.icon className={`w-6 h-6 mt-1 ${
                        selectedType === type.id ? 'text-blue-600' : 'text-gray-500'
                      }`} />
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-800">{type.name}</h5>
                        <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 2: Category Selection */}
            {selectedType && selectedTypeData && (
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                  Step 2: Select {selectedTypeData.name} Category
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {selectedTypeData.categories.map((category) => (
                    <button
                      key={category}
                      className={`p-3 rounded-lg text-sm font-medium transition-all ${
                        selectedCategory === category
                          ? 'bg-blue-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Continue Button */}
            {selectedType && selectedCategory && (
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={handleContinue}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-300"
                >
                  Continue to Standard Strategies
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
