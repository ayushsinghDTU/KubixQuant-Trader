import React, { useState } from 'react';
import { Home, User, Settings, Mail, FileText, TrendingUp, BarChart3 } from 'lucide-react';
import StrategyBuilder from './Components/StrategyBuilder';
import MarketAnalysis from './Components/MarketAnalysis';

import UserProfile from './Components/UserProfile';
import HomePage from './Components/HomePage';
import DocumentsPage from './Components/DocumentsPage';
import MessagesPage from './Components/MessagesPage';
import SettingsPage from './Components/SettingPage';
export default function App() {
  const [activeItem, setActiveItem] = useState('Home');

  const menuItems = [
    { name: 'Home', icon: Home },
    { name: 'Profile', icon: User },
    { name: 'Messages', icon: Mail },
    { name: 'Documents', icon: FileText },
    { name: 'Strategy Builder', icon: TrendingUp },
    { name: 'Market Analysis', icon: BarChart3 },
    { name: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch(activeItem) {
      case 'Home':
       return <HomePage/>;
      case 'Strategy Builder':
        return <StrategyBuilder />;
      case 'Market Analysis':
        return <MarketAnalysis />;

      case 'Profile':
        return <UserProfile />;
      case 'Messages':
       return <MessagesPage />;
      case 'Documents':
       return <DocumentsPage />;
      case 'Settings':
       return <SettingsPage />;
      default:
        return (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{activeItem}</h2>
            <p className="text-gray-600">Content for {activeItem} section</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-800">KubixQuant</h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => setActiveItem(item.name)}
                  className={`
                    w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors
                    ${activeItem === item.name
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <item.icon size={20} className="mr-3" />
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="flex-1 p-6 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
}