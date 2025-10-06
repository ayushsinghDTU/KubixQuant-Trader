import React, { useState } from 'react';
import { Mail, Bell, Zap, Trash2, Archive } from 'lucide-react';

// --- MOCK DATA ---
// A realistic set of messages with different types and read statuses.
const mockMessages = [
  { id: 1, type: 'System', subject: 'Strategy Deployment Successful', content: 'Your "RSI Momentum Scalper" strategy was deployed successfully and is now active.', timestamp: '2 hours ago', read: false },
  { id: 2, type: 'Trade', subject: 'Trade Executed: BUY BTC/USD', content: 'Successfully executed BUY order for 0.05 BTC at $68,750.12.', timestamp: '5 hours ago', read: false },
  { id: 3, type: 'Strategy', subject: 'Backtest Complete: Mean Reversion ETH', content: 'Your backtest for the "Mean Reversion ETH" strategy has completed with a simulated P&L of +12.5%. View the full report in Documents.', timestamp: '1 day ago', read: true },
  { id: 4, type: 'System', subject: 'API Key Nearing Expiration', content: 'Your primary API key is set to expire in 7 days. Please generate a new key to avoid service interruptions.', timestamp: '2 days ago', read: true },
  { id: 5, type: 'Trade', subject: 'Trade Executed: SELL TSLA', content: 'Successfully executed SELL order for 10 shares of TSLA at $182.90.', timestamp: '3 days ago', read: true },
];

const tabs = [
    { name: 'System Notifications', type: 'System', icon: Bell },
    { name: 'Trade Alerts', type: 'Trade', icon: Zap },
    { name: 'Strategy Updates', type: 'Strategy', icon: Mail }
]

export default function MessagesPage() {
  const [messages, setMessages] = useState(mockMessages);
  const [activeTab, setActiveTab] = useState('System');
  const [selectedMessage, setSelectedMessage] = useState(mockMessages.find(m => m.type === 'System'));

  const handleSelectMessage = (id) => {
    // Set the selected message
    setSelectedMessage(messages.find(m => m.id === id));
    // Mark the message as read
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
  };

  const handleDeleteMessage = (id) => {
    setMessages(prev => prev.filter(m => m.id !== id));
    // If the deleted message was the selected one, clear the selection
    if (selectedMessage && selectedMessage.id === id) {
      setSelectedMessage(null);
    }
  }

  const filteredMessages = messages.filter(m => m.type === activeTab);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Messages</h2>
      
      <div className="bg-white rounded-lg shadow-md flex h-[calc(100vh-12rem)]">
        {/* Sidebar with Message List */}
        <div className="w-1/3 border-r flex flex-col">
           {/* Tabs */}
           <div className="p-2 border-b">
                <div className="flex space-x-2">
                    {tabs.map(tab => (
                        <button 
                            key={tab.name}
                            onClick={() => {
                                setActiveTab(tab.type)
                                // Select the first message of the new tab if available
                                setSelectedMessage(messages.find(m => m.type === tab.type) || null)
                            }}
                            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                activeTab === tab.type ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            <tab.icon size={16} />
                            {tab.name}
                        </button>
                    ))}
                </div>
            </div>
          {/* Message List */}
          <ul className="overflow-y-auto">
            {filteredMessages.map(message => (
              <li key={message.id}>
                <button
                  onClick={() => handleSelectMessage(message.id)}
                  className={`w-full text-left p-4 border-l-4 ${
                    selectedMessage?.id === message.id 
                    ? 'bg-blue-50 border-blue-500' 
                    : 'border-transparent hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <p className="font-semibold text-gray-800">{message.subject}</p>
                    {!message.read && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full mt-1 flex-shrink-0"></div>}
                  </div>
                  <p className="text-sm text-gray-500 truncate">{message.content}</p>
                  <p className="text-xs text-gray-400 mt-1">{message.timestamp}</p>
                </button>
              </li>
            ))}
             {filteredMessages.length === 0 && (
                <p className="p-6 text-center text-gray-500">No messages in this category.</p>
            )}
          </ul>
        </div>

        {/* Main Message Content View */}
        <div className="w-2/3 p-6 flex flex-col">
          {selectedMessage ? (
            <>
              <div className="pb-4 border-b">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{selectedMessage.subject}</h3>
                    <div className="flex items-center gap-2">
                        <button onClick={() => handleDeleteMessage(selectedMessage.id)} className="p-2 text-gray-500 hover:bg-gray-100 hover:text-red-500 rounded-full">
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
                <p className="text-sm text-gray-500">{selectedMessage.timestamp}</p>
              </div>
              <div className="py-6 text-gray-700 leading-relaxed flex-grow">
                {selectedMessage.content}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>Select a message to read</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
