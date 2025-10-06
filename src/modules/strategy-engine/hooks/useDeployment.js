// src/modules/strategy-engine/hooks/useDeployment.js
import { useState } from 'react';

const useDeployment = () => {
  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    apiKey: '',
    apiSecret: '',
    product_id: '',
    size: '',
    side: 'buy',
    order_type: 'market_order',
    limit_price: '',
    time_in_force: 'gtc',
    post_only: false,
    reduce_only: false,
    capital: '',
    client_order_id: ''
  });

  const handleDeployClick = (strategy) => {
    setSelectedStrategy(strategy);
    setIsDialogOpen(true);
    
    // Set default recommendations based on strategy risk
    const riskLevel = strategy.risk?.toLowerCase();
    let defaults = {};
    
    switch (riskLevel) {
      case 'low':
        defaults = {
          size: '2',
          capital: '200',
          product_id: '27' // BTCUSD default
        };
        break;
      case 'medium':
        defaults = {
          size: '5',
          capital: '1000',
          product_id: '27'
        };
        break;
      case 'high':
        defaults = {
          size: '10',
          capital: '2000',
          product_id: '27'
        };
        break;
      default:
        defaults = {
          size: '1',
          capital: '100',
          product_id: '27'
        };
    }
    
    setFormData(prev => ({
      ...prev,
      ...defaults,
      client_order_id: `strategy_${Date.now()}`
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    // Reset form after animation completes
    setTimeout(() => {
      setSelectedStrategy(null);
      setFormData({
        apiKey: '',
        apiSecret: '',
        product_id: '',
        size: '',
        side: 'buy',
        order_type: 'market_order',
        limit_price: '',
        time_in_force: 'gtc',
        post_only: false,
        reduce_only: false,
        capital: '',
        client_order_id: ''
      });
    }, 500);
  };

  return {
    selectedStrategy,
    isDialogOpen,
    formData,
    handleDeployClick,
    handleInputChange,
    handleCloseDialog
  };
};

export { useDeployment };
