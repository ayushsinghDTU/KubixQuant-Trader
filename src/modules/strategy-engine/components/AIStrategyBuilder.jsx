// src/modules/strategy-engine/components/AIStrategyBuilder.jsx
import React, { useState } from 'react';
import { X, Bot, Send, User, Lightbulb, Code, CheckCircle, AlertCircle } from 'lucide-react';

export const AIStrategyBuilder = ({ isOpen, onClose, tradingType, category, onStrategyComplete }) => {
  const [messages, setMessages] = useState([
    {
      type: 'ai',
      content: `Hi! I'm your AI Strategy Assistant 🤖\n\nI'll help you create a custom ${category} strategy for ${tradingType} trading. Let's start:\n\n✨ **Tell me about your strategy idea:**\n- What market signals do you want to use?\n- What's your risk tolerance?\n- Any specific indicators you prefer?\n\nFor example: "I want a momentum strategy using RSI and volume for swing trading stocks"`
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [strategyData, setStrategyData] = useState(null);
  const [currentStep, setCurrentStep] = useState('description'); // description, parameters, confirmation

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const newUserMessage = { type: 'user', content: userInput };
    setMessages(prev => [...prev, newUserMessage]);
    setUserInput('');
    setIsLoading(true);

    // Simulate AI processing
    setTimeout(() => {
      let aiResponse = generateAIResponse(userInput, currentStep);
      setMessages(prev => [...prev, { type: 'ai', content: aiResponse.content }]);
      
      if (aiResponse.strategyData) {
        setStrategyData(aiResponse.strategyData);
      }
      
      if (aiResponse.nextStep) {
        setCurrentStep(aiResponse.nextStep);
      }
      
      setIsLoading(false);
    }, 2000);
  };

  const generateAIResponse = (input, step) => {
    const responses = {
      description: {
        content: `Great! I understand you want to create: "${input}"\n\n🔍 **Let me clarify a few details:**\n\n1. **Entry Conditions:** When should the strategy buy?\n2. **Exit Conditions:** When should it sell?\n3. **Risk Management:** Stop loss percentage?\n4. **Position Size:** How much capital per trade?\n5. **Timeframe:** Which chart timeframe (1min, 5min, 1day)?\n\nPlease provide these details so I can code your strategy!`,
        nextStep: 'parameters'
      },
      parameters: {
        content: `Perfect! Based on your requirements, I'll create this strategy:\n\n📋 **Strategy Summary:**\n- **Name:** ${extractStrategyName(input)}\n- **Type:** ${category} for ${tradingType}\n- **Entry:** ${extractEntryLogic(input)}\n- **Exit:** ${extractExitLogic(input)}\n- **Risk:** ${extractRiskLevel(input)}\n\n🔧 **Generated Code Structure:**\n\`\`\`python\nclass CustomStrategy:\n    def __init__(self):\n        self.indicators = ['RSI', 'MA', 'Volume']\n    \n    def entry_signal(self, data):\n        # Your custom entry logic\n        return signal\n    \n    def exit_signal(self, data):\n        # Your custom exit logic\n        return signal\n\`\`\`\n\n✅ **Confirm Strategy Creation?** Type 'yes' to add this to your portfolio!`,
        strategyData: {
          name: extractStrategyName(input),
          description: `AI-generated ${category} strategy based on user requirements`,
          risk: extractRiskLevel(input),
          source: 'AI-Generated Custom Strategy',
          category: category,
          isCustom: true,
          code: generateStrategyCode(input)
        },
        nextStep: 'confirmation'
      },
      confirmation: {
        content: `🎉 **Strategy Created Successfully!**\n\nYour custom AI-generated strategy is ready:\n\n✅ **"${strategyData?.name}"**\n📊 Category: ${category}\n🎯 Risk Level: ${strategyData?.risk}\n🤖 AI-Generated Code: Ready\n\n🚀 **Next Steps:**\n1. Strategy added to your portfolio\n2. You can backtest it\n3. Deploy when ready\n\nThe strategy will appear in your main dashboard!`,
        complete: true
      }
    };

    return responses[step] || responses.description;
  };

  const extractStrategyName = (input) => {
    // Simple AI logic to extract strategy name
    const keywords = input.toLowerCase();
    if (keywords.includes('rsi')) return 'Custom RSI Strategy';
    if (keywords.includes('momentum')) return 'Custom Momentum Strategy';
    if (keywords.includes('volume')) return 'Custom Volume Strategy';
    return 'Custom AI Strategy';
  };

  const extractEntryLogic = (input) => {
    return 'Buy when indicators align with trend';
  };

  const extractExitLogic = (input) => {
    return 'Sell on reversal signals or stop loss';
  };

  const extractRiskLevel = (input) => {
    const keywords = input.toLowerCase();
    if (keywords.includes('conservative') || keywords.includes('low risk')) return 'Low';
    if (keywords.includes('aggressive') || keywords.includes('high risk')) return 'High';
    return 'Medium';
  };

  const generateStrategyCode = (input) => {
    return `// AI-Generated Strategy Code
class CustomStrategy {
  constructor() {
    this.name = "${extractStrategyName(input)}";
    this.indicators = ['RSI', 'MA', 'Volume'];
  }
  
  entrySignal(data) {
    // Entry logic based on user requirements
    const rsi = data.rsi;
    const volume = data.volume;
    return rsi < 30 && volume > data.avgVolume;
  }
  
  exitSignal(data) {
    // Exit logic
    const rsi = data.rsi;
    return rsi > 70;
  }
}`;
  };

  const handleConfirmStrategy = () => {
    if (strategyData) {
      onStrategyComplete(strategyData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl p-4 text-white flex-shrink-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Bot className="w-6 h-6" />
              <div>
                <h3 className="text-lg font-bold">AI Strategy Builder</h3>
                <p className="text-blue-100 text-sm">Creating {category} strategy for {tradingType}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-3xl p-3 rounded-lg ${
                  message.type === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white border shadow-sm'
                }`}>
                  <div className="flex items-start space-x-2">
                    {message.type === 'ai' && <Bot className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />}
                    {message.type === 'user' && <User className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />}
                    <pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed">
                      {message.content}
                    </pre>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border shadow-sm p-3 rounded-lg max-w-xs">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-5 h-5 text-blue-500 animate-pulse" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t bg-white p-4 flex-shrink-0">
          {currentStep === 'confirmation' && strategyData ? (
            <div className="flex space-x-3">
              <button
                onClick={handleConfirmStrategy}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center space-x-2"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Add Strategy to Portfolio</span>
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex space-x-3">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Describe your strategy or answer AI questions..."
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !userInput.trim()}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white p-3 rounded-lg transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
