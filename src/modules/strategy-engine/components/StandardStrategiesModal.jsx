// src/modules/strategy-engine/components/StandardStrategiesModal.jsx
import React, { useState } from 'react';
import { X, BookOpen, TrendingUp, CheckCircle, Bot, MessageCircle } from 'lucide-react';
import { AIStrategyBuilder } from './AIStrategyBuilder';

export const StandardStrategiesModal = ({ 
  isOpen, 
  onClose, 
  tradingType, 
  category, 
  onSelectStrategy, 
  onCreateCustom 
}) => {
  const [showAIBuilder, setShowAIBuilder] = useState(false);

  // Complete strategy database
  const comprehensiveStrategies = {
    stock: {
      'Position Trading': [
        { name: 'Trend Following Position', description: 'Long-term trend identification and riding', risk: 'Medium', source: 'Trend Following by Michael Covel' },
        { name: 'Value Investing Position', description: 'Undervalued stocks with strong fundamentals', risk: 'Low', source: 'The Intelligent Investor' },
        { name: 'Growth Stock Position', description: 'High-growth companies with expanding earnings', risk: 'Medium', source: 'One Up On Wall Street' },
        { name: 'Dividend Growth Position', description: 'Consistent dividend-growing companies', risk: 'Low', source: 'Common Sense Investing' },
        { name: 'Momentum Position', description: 'Stocks showing persistent momentum', risk: 'High', source: 'Quantitative Momentum' },
        { name: 'Quality Factor Position', description: 'High ROE, low debt companies', risk: 'Low', source: 'Quality Investing' },
        { name: 'Small Cap Growth', description: 'Emerging small companies with potential', risk: 'High', source: 'Small-Cap Investing' },
        { name: 'Sector Momentum Position', description: 'Strong sectors in economic cycles', risk: 'Medium', source: 'Sector Investing' },
        { name: 'Technical Breakout Position', description: 'Long-term chart pattern breakouts', risk: 'Medium', source: 'How to Make Money in Stocks' },
        { name: 'GARP Strategy Position', description: 'Growth at reasonable price approach', risk: 'Medium', source: 'Value Investing' },
        { name: 'Dogs of the Dow Position', description: 'High-yield Dow components strategy', risk: 'Low', source: 'Beating the Dow' },
        { name: 'Buyback Position', description: 'Companies with active share buybacks', risk: 'Medium', source: 'The Outsiders' },
        { name: 'Insider Buying Position', description: 'Following corporate insider purchases', risk: 'Medium', source: 'Legal Insider Trading' },
        { name: 'ESG Investing Position', description: 'Environmental, social, governance factors', risk: 'Medium', source: 'Sustainable Investing' },
        { name: 'Turnaround Position', description: 'Companies in recovery phase', risk: 'High', source: 'Stock Market Genius' },
        { name: 'Contrarian Position', description: 'Buy when others are selling', risk: 'Medium', source: 'Contrarian Investment Strategies' },
        { name: 'Macro Theme Position', description: 'Long-term economic theme plays', risk: 'Medium', source: 'The Big Idea' },
        { name: 'Seasonal Position', description: 'Calendar effect and seasonal patterns', risk: 'Low', source: 'Stock Trader\'s Almanac' },
        { name: 'Analyst Upgrade Position', description: 'Following analyst recommendation changes', risk: 'Medium', source: 'Wall Street Research' },
        { name: 'Fundamental Analysis Position', description: 'Deep dive into company financials', risk: 'Low', source: 'Security Analysis' }
      ],
      'Swing Trading': [
        { name: 'MA Crossover Swing', description: '20/50 MA cross for swing entries', risk: 'Medium', source: 'Technical Analysis of Financial Markets' },
        { name: 'RSI Divergence Swing', description: 'Hidden divergences for trend continuation', risk: 'Medium', source: 'Market Wizards' },
        { name: 'Support/Resistance Swing', description: 'Multi-timeframe S/R levels', risk: 'Low', source: 'Trading Price Action' },
        { name: 'Bollinger Band Squeeze', description: 'Low volatility leading to expansion', risk: 'Medium', source: 'Bollinger on Bollinger Bands' },
        { name: 'Flag Pattern Swing', description: 'Bull/bear flag continuation patterns', risk: 'Medium', source: 'Chart Patterns' },
        { name: 'Triangle Breakout Swing', description: 'Symmetrical triangle breakouts', risk: 'Medium', source: 'Encyclopedia of Chart Patterns' },
        { name: 'Double Top/Bottom Swing', description: 'Classic reversal patterns', risk: 'Medium', source: 'Technical Analysis Explained' },
        { name: 'Head & Shoulders Swing', description: 'Major reversal pattern trading', risk: 'Medium', source: 'Pattern Recognition' },
        { name: 'Channel Trading Swing', description: 'Trade within trending channels', risk: 'Low', source: 'Channel Analysis' },
        { name: 'Fibonacci Retracement', description: '38.2%, 50%, 61.8% retracement levels', risk: 'Medium', source: 'Fibonacci Trading' },
        { name: 'MACD Histogram Swing', description: 'Histogram divergences for timing', risk: 'Medium', source: 'MACD Strategies' },
        { name: 'Volume Profile Swing', description: 'Value area and POC trading', risk: 'Medium', source: 'Market Profile Trading' },
        { name: 'Momentum Swing', description: 'Ride strong momentum moves', risk: 'High', source: 'Momentum Trading' },
        { name: 'Mean Reversion Swing', description: 'Extreme moves back to mean', risk: 'Medium', source: 'Mean Reversion Strategies' },
        { name: 'Sector Rotation Swing', description: 'Follow sector strength cycles', risk: 'Medium', source: 'Sector Analysis' },
        { name: 'Earnings Swing', description: 'Pre/post earnings momentum', risk: 'High', source: 'Earnings Trading' },
        { name: 'News-Based Swing', description: 'Fundamental news-driven swings', risk: 'High', source: 'News Trading' },
        { name: 'Gap Trading Swing', description: 'Gap up/down continuation', risk: 'Medium', source: 'Gap Analysis' },
        { name: 'Relative Strength Swing', description: 'Stock vs market strength', risk: 'Medium', source: 'Relative Strength Analysis' },
        { name: 'Seasonal Swing', description: 'Calendar-based trading patterns', risk: 'Low', source: 'Stock Trader\'s Almanac' }
      ],
      'Scalping': [
        { name: '1-Minute RSI Scalping', description: 'Quick RSI reversals on 1-min charts', risk: 'High', source: 'Day Trading For Living' },
        { name: 'Volume Spike Scalping', description: 'Trade sudden volume spikes', risk: 'High', source: 'Market Microstructure' },
        { name: 'VWAP Scalping', description: 'Mean reversion around VWAP levels', risk: 'Medium', source: 'Institutional Trading' },
        { name: 'Level 2 Scalping', description: 'Order book analysis for entry timing', risk: 'High', source: 'Market Wizards' },
        { name: 'Momentum Scalping', description: 'Ride short-term momentum bursts', risk: 'High', source: 'Scalping Strategies' },
        { name: 'News Event Scalping', description: 'Quick trades around earnings/news', risk: 'Very High', source: 'Event-Driven Trading' },
        { name: 'Gap Fill Scalping', description: 'Trade morning gap fill patterns', risk: 'Medium', source: 'Gap Trading Manual' },
        { name: 'Support/Resistance Scalp', description: 'Quick bounces off key levels', risk: 'Medium', source: 'Price Action Trading' },
        { name: 'Moving Average Scalp', description: 'Fast MA crosses for entries', risk: 'Medium', source: 'MA Trading Systems' },
        { name: 'Stochastic Scalping', description: 'Overbought/oversold quick reversals', risk: 'Medium', source: 'Oscillator Strategies' }
      ],
      'Value Investing': [
        { name: 'Deep Value Investing', description: 'Extremely undervalued stocks', risk: 'Medium', source: 'The Intelligent Investor' },
        { name: 'Dividend Value Strategy', description: 'High-dividend yield stocks', risk: 'Low', source: 'Big Dividends' },
        { name: 'Magic Formula', description: 'Earnings yield and return on capital', risk: 'Medium', source: 'Beats the Market' },
        { name: 'Asset-Based Value', description: 'Companies trading below liquidation value', risk: 'Medium', source: 'Security Analysis' },
        { name: 'Earnings Value Strategy', description: 'Low P/E stocks with consistent earnings', risk: 'Low', source: 'What Works on Wall Street' },
        { name: 'Cash Flow Value', description: 'Strong free cash flow at discount prices', risk: 'Low', source: 'The Little Book of Value Investing' },
        { name: 'Book Value Strategy', description: 'Stocks trading below book value', risk: 'Medium', source: 'The Acquirer\'s Multiple' },
        { name: 'Contrarian Value', description: 'Unpopular sectors and out-of-favor stocks', risk: 'Medium', source: 'Contrarian Investment Strategies' }
      ]
    },
    index: {
      'Trend Following': [
        { name: 'Nifty Trend Rider', description: 'Long-term trend following on Nifty 50', risk: 'Medium', source: 'Trend Following Strategies' },
        { name: 'Moving Average Cross', description: '50/200 MA crossover system', risk: 'Low', source: 'Technical Analysis' },
        { name: 'Index Momentum', description: 'Momentum-based index trading', risk: 'High', source: 'Momentum Trading Strategies' },
        { name: 'Breakout Trend', description: 'Index breakout with trend confirmation', risk: 'Medium', source: 'Breakout Trading' },
        { name: 'ADX Trend System', description: 'Average Directional Index trend strength', risk: 'Medium', source: 'New Concepts in Technical Trading' }
      ],
      'Breakout': [
        { name: 'Index Breakout Pro', description: 'Professional index breakout system', risk: 'High', source: 'High Probability Trading' },
        { name: 'Range Breakout', description: 'Trade range breakouts with volume', risk: 'Medium', source: 'Trading Range Breakouts' },
        { name: 'Volume Breakout', description: 'Volume-confirmed breakouts', risk: 'Medium', source: 'Volume Price Analysis' }
      ],
      'Mean Reversion': [
        { name: 'Index Mean Reversion', description: 'Trade back to mean after extremes', risk: 'Medium', source: 'Mean Reversion Trading' },
        { name: 'Bollinger Band Reversion', description: 'Trade reversals at band extremes', risk: 'Low', source: 'Bollinger Bands' }
      ],
      'Momentum': [
        { name: 'Index Momentum Burst', description: 'Capture strong momentum moves', risk: 'High', source: 'Momentum Strategies' },
        { name: 'Sector Rotation Momentum', description: 'Follow rotating sector strength', risk: 'Medium', source: 'Sector Analysis' }
      ]
    },
    futures: {
      'Spread Trading': [
        { name: 'Calendar Spread', description: 'Trade different expiry months', risk: 'Low', source: 'Futures Spread Trading' },
        { name: 'Inter-commodity Spread', description: 'Trade related commodities', risk: 'Medium', source: 'Commodity Trading' },
        { name: 'Butterfly Spread', description: 'Complex spread strategy', risk: 'Medium', source: 'Advanced Futures' }
      ]
    },
    options: {
      'Iron Condor': [
        { name: 'Monthly Iron Condor', description: 'Sell volatility strategy', risk: 'Medium', source: 'Options Strategies' },
        { name: 'Weekly Iron Condor', description: 'Short-term volatility play', risk: 'High', source: 'Weekly Options' },
        { name: 'Adaptive Iron Condor', description: 'Dynamic adjustment strategy', risk: 'Medium', source: 'Advanced Options' }
      ]
    }
  };

  const getStrategiesForType = () => {
    console.log('Getting strategies for:', { tradingType, category });
    const strategies = comprehensiveStrategies[tradingType]?.[category] || [];
    console.log('Found strategies:', strategies.length);
    return strategies;
  };

  const handleCustomStrategyClick = () => {
    setShowAIBuilder(true);
  };

  const handleAIStrategyComplete = (aiGeneratedStrategy) => {
    onSelectStrategy(aiGeneratedStrategy);
    setShowAIBuilder(false);
    
    setTimeout(() => {
      alert(`🤖 AI Strategy Created Successfully!\n\n✅ "${aiGeneratedStrategy.name}" has been generated and added to your portfolio.\n🧠 AI-powered strategy with custom logic\n📊 Ready for backtesting and deployment!`);
    }, 100);
  };

  const handleStrategySelect = (strategy) => {
    onSelectStrategy(strategy);
    setTimeout(() => {
      alert(`🎉 Success! "${strategy.name}" strategy has been added to your strategy list. You can now deploy it from the main dashboard.`);
    }, 100);
  };

  if (!isOpen) return null;

  // Add error checking
  if (!tradingType || !category) {
    console.error('Missing props:', { tradingType, category });
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl p-6 max-w-md">
          <h3 className="text-lg font-bold text-red-600 mb-2">⚠️ Configuration Error</h3>
          <p className="text-gray-600 mb-4">Missing trading type or category. Please go back and select again.</p>
          <button onClick={onClose} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            Close & Retry
          </button>
        </div>
      </div>
    );
  }

  const standardStrategies = getStrategiesForType();

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-t-2xl p-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold">Choose Your {category} Strategy</h3>
                <p className="text-purple-100">Select from proven strategies or create with AI assistance</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg">
                <X size={24} />
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* AI Strategy Builder Button */}
            <div className="mb-6">
              <button
                onClick={handleCustomStrategyClick}
                className="w-full p-6 border-2 border-dashed border-blue-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group bg-gradient-to-r from-blue-50 to-purple-50"
              >
                <div className="flex items-center justify-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                    <Bot className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-lg font-semibold text-blue-800 group-hover:text-blue-900">
                      🤖 Create Custom Strategy with AI
                    </h4>
                    <p className="text-blue-600 text-sm mt-1">
                      Describe your strategy idea and let AI help you build it step by step
                    </p>
                  </div>
                  <MessageCircle className="w-6 h-6 text-blue-500 group-hover:text-blue-600" />
                </div>
              </button>
            </div>

            {/* Standard Strategies Grid */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                {standardStrategies.length} Proven {category} Strategies
              </h4>
              
              {standardStrategies.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {standardStrategies.map((strategy, index) => (
                    <div 
                      key={index}
                      className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer group relative"
                      onClick={() => handleStrategySelect(strategy)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h5 className="font-semibold text-gray-800 group-hover:text-blue-600 text-sm leading-tight">
                          {strategy.name}
                        </h5>
                        <span className={`px-2 py-1 text-xs rounded-full flex-shrink-0 ml-2 ${
                          strategy.risk === 'Low' ? 'bg-green-100 text-green-700' :
                          strategy.risk === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          strategy.risk === 'High' ? 'bg-red-100 text-red-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {strategy.risk}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3 leading-relaxed">{strategy.description}</p>
                      
                      <div className="text-xs text-blue-600 mb-3 font-medium">
                        📚 {strategy.source}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-blue-600 text-sm font-medium">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Add Strategy
                        </div>
                        <TrendingUp className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No standard strategies available for {category} in {tradingType} trading.</p>
                  <p className="text-sm mt-2">You can create a custom strategy with AI assistance instead.</p>
                </div>
              )}
            </div>

            {/* Info Panel */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <BookOpen className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">📖 Research-Based Strategies</p>
                  <p>All strategies are sourced from renowned trading books, institutional research, and proven market methodologies. Each strategy includes risk assessment and source references for further study.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Strategy Builder Modal */}
      <AIStrategyBuilder
        isOpen={showAIBuilder}
        onClose={() => setShowAIBuilder(false)}
        tradingType={tradingType}
        category={category}
        onStrategyComplete={handleAIStrategyComplete}
      />
    </>
  );
};
