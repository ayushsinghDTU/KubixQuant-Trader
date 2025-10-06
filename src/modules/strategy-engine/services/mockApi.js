// src/services/mockApi.js

// Simulate fetching market overview data
export async function fetchMarketOverview() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        totalMarketCap: 1720000000000,
        total24hVolume: 89000000000,
        totalExchanges: 584,
        btcDominance: 52.3,
        topCryptos: [
          { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', price: 43250, change: 2.45, marketCap: 847000000000, iconUrl: 'https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.18.1/32/color/btc.png' },
          { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', price: 2650, change: -1.23, marketCap: 318000000000, iconUrl: 'https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.18.1/32/color/eth.png' },
          // Add more if needed
        ]
      });
    }, 800);
  });
}

// Simulate fetching open positions from Delta Exchange
export async function fetchOpenPositions() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        {
          id: 'pos1',
          symbol: 'BTCUSD',
          side: 'Long',
          size: 0.5,
          entryPrice: 44250,
          currentPrice: 45000,
          pnl: 375,
          pnlPercent: 1.69,
          margin: 4425,
          leverage: '10x',
          timestamp: Date.now() - 3600000,
          status: 'Active'
        },
        {
          id: 'pos2',
          symbol: 'ETHUSD',
          side: 'Short',
          size: 2.0,
          entryPrice: 2850,
          currentPrice: 2820,
          pnl: 60,
          pnlPercent: 1.05,
          margin: 570,
          leverage: '5x',
          timestamp: Date.now() - 7200000,
          status: 'Active'
        }
      ]);
    }, 800);
  });
}
