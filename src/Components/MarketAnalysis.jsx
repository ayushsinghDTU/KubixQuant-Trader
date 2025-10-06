import React, { useState, useEffect, useRef, memo } from 'react';
import { Bell, Download, RefreshCw, Plus, Search, TrendingUp, HelpCircle, X, Trash2, BellRing } from 'lucide-react';

// --- API Configuration & Services ---
const coinrankingConfig = {
    baseUrl: `https://${import.meta.env.VITE_RAPIDAPI_HOST}`,
    apiKey: import.meta.env.VITE_RAPIDAPI_KEY,
    host: import.meta.env.VITE_RAPIDAPI_HOST,
};
const binanceConfig = {
    baseUrl: 'https://api.binance.com/api/v3',
};
const apiService = {
    fetchWatchlistCoins: async () => {
        const url = `${coinrankingConfig.baseUrl}/coins?limit=10`;
        const options = {
            headers: {
                'X-RapidAPI-Key': coinrankingConfig.apiKey,
                'X-RapidAPI-Host': coinrankingConfig.host,
            },
        };
        try {
            const response = await fetch(url, options);
            const result = await response.json();
            if (result.status === 'success') {
                return result.data.coins.map(coin => ({
                    uuid: coin.uuid,
                    symbol: coin.symbol,
                    name: coin.name,
                    price: parseFloat(coin.price),
                    change: parseFloat(coin.change),
                    iconUrl: coin.iconUrl,
                    volume: parseFloat(coin['24hVolume']),
                }));
            }
        } catch (error) {
            console.error("Error fetching watchlist from Coinranking:", error);
            return [];
        }
    },
    fetchOrderBook: async (symbol) => {
        const binanceSymbol = symbol.replace(/USD$/, 'USDT');
        const url = `${binanceConfig.baseUrl}/depth?symbol=${binanceSymbol}&limit=10`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.bids && data.asks) {
                return {
                    asks: data.asks.slice(0, 5).map(ask => ({ price: parseFloat(ask[0]), amount: parseFloat(ask[1]) })),
                    bids: data.bids.slice(0, 5).map(bid => ({ price: parseFloat(bid[0]), amount: parseFloat(bid[1]) })),
                };
            }
            return { asks: [], bids: [] };
        } catch (error) {
            console.error(`Error fetching order book for ${binanceSymbol}:`, error);
            return { asks: [], bids: [] };
        }
    },
};

// --- Reusable Hooks ---
const useRealTimeWatchlist = () => {
    const [watchlist, setWatchlist] = useState([]);
    useEffect(() => {
        const getWatchlistData = async () => {
            const data = await apiService.fetchWatchlistCoins();
            if (data && data.length > 0) setWatchlist(data);
        };
        getWatchlistData();
        const interval = setInterval(getWatchlistData, 30000);
        return () => clearInterval(interval);
    }, []);
    return watchlist;
};
const useMarketData = (selectedCoin) => {
    const [data, setData] = useState({ high: 0, low: 0, marketCap: '0', orderBook: { asks: [], bids: [] }, volatility: 0 });
    useEffect(() => {
        if (!selectedCoin || selectedCoin.price === 0) return;
        setData(prev => ({
            ...prev,
            high: selectedCoin.price * (1 + Math.abs(selectedCoin.change) / 100),
            low: selectedCoin.price * (1 - Math.abs(selectedCoin.change) / 100),
            marketCap: `$${(selectedCoin.volume * selectedCoin.price / 1e9).toFixed(2)}B`,
            volatility: Math.min(100, Math.abs(selectedCoin.change) * 4)
        }));
        const fetchRealOrderBook = async () => {
            const orderBookData = await apiService.fetchOrderBook(selectedCoin.symbol);
            if (orderBookData.asks.length > 0 || orderBookData.bids.length > 0) {
                setData(prev => ({ ...prev, orderBook: orderBookData }));
            } else {
                const price = selectedCoin.price;
                const asks = Array.from({ length: 5 }, (_, i) => ({ price: price + ((i + 1) * price * 0.0001), amount: Math.random() * 2 }));
                const bids = Array.from({ length: 5 }, (_, i) => ({ price: price - ((i + 1) * price * 0.0001), amount: Math.random() * 2 }));
                setData(prev => ({ ...prev, orderBook: { asks: asks.reverse(), bids } }));
            }
        };
        fetchRealOrderBook();
        const interval = setInterval(fetchRealOrderBook, 5000);
        return () => clearInterval(interval);
    }, [selectedCoin]);
    return data;
};

// --- UI Components ---
const Header = ({ onAlertClick, onExportClick, alertCount }) => (
    <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-[1920px] mx-auto px-6 py-4 flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold">Market Analysis</h1>
                <p className="text-sm text-gray-400">Live Data via Coinranking & Binance Order Book</p>
            </div>
            <div className="flex items-center gap-3">
                <button onClick={onAlertClick} className="relative px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all flex items-center gap-2 text-sm">
                    <Bell className="w-4 h-4" /> Alerts
                    {alertCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                            {alertCount}
                        </span>
                    )}
                </button>
                <button onClick={onExportClick} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all flex items-center gap-2 text-sm"><Download className="w-4 h-4" /> Export</button>
                <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all flex items-center gap-2 text-sm font-semibold"><RefreshCw className="w-4 h-4" /> Refresh</button>
            </div>
        </div>
    </header>
);
const Watchlist = ({ watchlistData, selectedSymbol, onSymbolSelect }) => { /* Unchanged */ return ( <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 h-full flex flex-col"> <div className="p-4 border-b border-white/10"> <div className="flex items-center justify-between mb-4"> <h2 className="font-semibold text-lg">Watchlist</h2> <button className="p-2 hover:bg-white/10 rounded-lg transition-all" title="Add Symbol"><Plus className="w-4 h-4" /></button> </div><div className="relative"> <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /> <input type="text" placeholder="Search symbols..." className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition" /> </div></div><div className="flex-1 p-2 overflow-y-auto"> {watchlistData.map((item) => ( <button key={item.uuid} onClick={() => onSymbolSelect(item)} className={`w-full p-3 rounded-lg mb-2 transition-all text-left ${selectedSymbol === item.symbol ? 'bg-blue-600/40 border border-blue-500/60 shadow-lg' : 'hover:bg-white/10'}`}> <div className="flex items-center justify-between mb-1"> <span className="font-semibold text-sm flex items-center gap-2"><img src={item.iconUrl} alt={item.name} className="w-4 h-4" />{item.symbol}</span> <span className={`text-sm font-semibold ${item.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>{item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%</span> </div><div className="flex items-center justify-between text-xs"> <span className="text-gray-400">{item.name}</span> <span className="font-mono">${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</span> </div></button> ))} </div></div> );};
const timeframes = ['15M', '1H', '4H', '1D', '1W']; const TradingViewChart = memo(({ symbol }) => { const container = useRef(); const [interval, setInterval] = useState('D'); useEffect(() => { const script = document.createElement("script"); script.src = "https://s3.tradingview.com/tv.js"; script.async = true; script.onload = () => { if (window.TradingView) { new window.TradingView.widget({ autosize: true, symbol: `COINBASE:${symbol.replace(/USD$/, '')}USD`, interval: interval === '1D' ? 'D' : interval === '1W' ? 'W' : interval.slice(0, -1), timezone: "Etc/UTC", theme: "dark", style: "1", locale: "en", toolbar_bg: "#f1f3f6", enable_publishing: false, hide_side_toolbar: false, allow_symbol_change: true, container_id: "tradingview_chart_container" }); } }; document.body.appendChild(script); return () => { document.body.removeChild(script); if (container.current) { container.current.innerHTML = ''; } } }, [symbol, interval]); return ( <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-4 lg:p-6 mb-6"> <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4"> <div> <h2 className="text-2xl font-bold">{symbol}</h2> <div className="flex items-center gap-3 mt-1 text-green-400"> <TrendingUp className="w-4 h-4" /><span className="text-sm font-semibold">Real-Time Price Action</span> </div></div><div className="flex items-center gap-1 sm:gap-2 mt-3 sm:mt-0"> {timeframes.map(tf => ( <button key={tf} onClick={() => setInterval(tf === '1D' ? 'D' : tf)} className={`px-3 py-1.5 text-xs sm:text-sm rounded-lg transition-all ${((interval === 'D' && tf === '1D') || interval === tf) ? 'bg-blue-600 text-white font-semibold' : 'bg-white/5 hover:bg-white/10'}`}> {tf} </button> ))} </div></div><div id="tradingview_chart_container" ref={container} className="h-[450px] lg:h-[500px] w-full" /> </div> ); });
const TechnicalIndicators = ({ selectedCoin }) => { /* Unchanged */ const getStatusClass = (status) => { switch (status.toLowerCase()) { case 'bullish': case 'oversold': return 'bg-green-500/20 text-green-400'; case 'bearish': case 'overbought': return 'bg-red-500/20 text-red-400'; default: return 'bg-gray-500/20 text-gray-400'; } }; const rsiValue = (50 + selectedCoin.change * 1.5); const indicators = [ { name: 'RSI (14)', value: rsiValue.toFixed(2), status: rsiValue > 70 ? 'Overbought' : rsiValue < 30 ? 'Oversold' : 'Neutral' }, { name: 'MACD (12, 26, 9)', value: (selectedCoin.change * 10).toFixed(2), status: selectedCoin.change > 0 ? 'Bullish' : 'Bearish' }, { name: 'MA (50)', value: (selectedCoin.price * 0.98).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}), status: selectedCoin.price > (selectedCoin.price * 0.98) ? 'Bullish' : 'Bearish' }, { name: 'Change (24h)', value: `${selectedCoin.change.toFixed(2)}%`, status: selectedCoin.change > 0 ? 'Bullish' : 'Bearish' }, ]; return ( <div className="grid grid-cols-2 md:grid-cols-4 gap-4"> {indicators.map((indicator) => ( <div key={indicator.name} className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10 text-center sm:text-left"> <p className="text-xs sm:text-sm text-gray-400 mb-1 truncate" title={indicator.name}>{indicator.name}</p> <p className="text-lg sm:text-xl font-bold mb-2 font-mono">{indicator.value}</p> <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusClass(indicator.status)}`}>{indicator.status}</span> </div> ))} </div> );};
const MarketData = ({ selectedCoin, marketData }) => { /* Unchanged */ const [showHelp, setShowHelp] = useState(false); return ( <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 h-full p-6 flex flex-col"> <h3 className="font-semibold text-lg mb-4">Market Data</h3> <div className="space-y-4 mb-6"> <DataItem label="24h High" value={`$${marketData.high.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`} valueColor="text-green-400" /> <DataItem label="24h Low" value={`$${marketData.low.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`} valueColor="text-red-400" /> <DataItem label="24h Volume" value={`$${(selectedCoin.volume / 1e9).toFixed(2)}B`} /> <DataItem label="Market Cap" value={marketData.marketCap} /> </div><div className="border-t border-white/10 pt-4 mb-6"> <div className="flex items-center justify-between mb-3"> <h4 className="text-sm font-semibold">Order Book (Live)</h4> <button onClick={() => setShowHelp(true)} className="text-gray-400 hover:text-white transition"><HelpCircle className="w-4 h-4" /></button> </div><div className="grid grid-cols-3 text-xs font-semibold text-gray-400 mb-2"> <span>Price</span><span>Amount</span><span>Total</span> </div><div className="space-y-1"> {(() => { let askCumul = 0; return marketData.orderBook.asks.map((order, i) => { askCumul += order.amount; return <OrderBookItem key={`ask-${i}`} type="ask" price={order.price} amount={order.amount} total={askCumul} />; }); })()} <div className="py-1"><hr className="border-t border-white/20"/></div> {(() => { let bidCumul = 0; return marketData.orderBook.bids.map((order, i) => { bidCumul += order.amount; return <OrderBookItem key={`bid-${i}`} type="bid" price={order.price} amount={order.amount} total={bidCumul} />; }); })()} </div></div><div className="border-t border-white/10 pt-4 mt-auto"> <h4 className="text-sm font-semibold mb-3">Volatility</h4> <div className="bg-black/20 rounded-lg p-3"> <div className="flex justify-between mb-2"> <span className="text-xs text-gray-400">Implied (24h)</span> <span className="text-sm font-semibold">{marketData.volatility.toFixed(1)}%</span> </div><div className="w-full bg-white/10 rounded-full h-2"> <div className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 h-2 rounded-full" style={{ width: `${marketData.volatility}%` }}></div> </div></div></div>{showHelp && ( <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"> <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full text-white relative"> <button onClick={() => setShowHelp(false)} className="absolute top-2 right-2 text-gray-400 hover:text-white text-xl font-bold">&times;</button> <h3 className="text-lg font-semibold mb-4">How to Use the Order Book Effectively</h3> <p className="mb-2">The order book shows real-time buy (bids) and sell (asks) orders for the selected asset.</p> <ul className="list-disc list-inside mb-2 text-sm"> <li><strong>Price Levels:</strong> Watch for large orders at specific prices which can act as support or resistance.</li><li><strong>Cumulative Volume:</strong> Helps identify the strength of buying or selling pressure at different price points.</li><li><strong>Spread:</strong> The difference between the highest bid and lowest ask indicates market liquidity and volatility.</li><li><strong>Order Flow:</strong> Rapid changes in bids or asks can signal market sentiment shifts.</li></ul> </div></div> )} </div> );};
const DataItem = ({ label, value, valueColor = 'text-white' }) => (<div className="flex justify-between items-center text-sm"><span className="text-gray-400">{label}</span><span className={`font-semibold font-mono ${valueColor}`}>{value}</span></div>);
const OrderBookItem = ({ type, price, amount, total }) => (<div className="grid grid-cols-3 text-xs font-mono"><span className={type === 'ask' ? 'text-red-400' : 'text-green-400'}>{price.toFixed(4)}</span><span className="text-gray-300">{amount.toFixed(3)}</span><span className="text-gray-500">{total.toFixed(3)}</span></div>);

const CreateAlertModal = ({ isOpen, onClose, coin, onAddAlert }) => {
    const [condition, setCondition] = useState('above');
    const [price, setPrice] = useState('');
    const [note, setNote] = useState('');
    useEffect(() => {
        if (coin) setPrice(coin.price.toFixed(2));
    }, [coin]);
    if (!isOpen || !coin) return null;
    const handleCreateAlert = (e) => {
        e.preventDefault();
        const newAlert = { id: Date.now(), symbol: coin.symbol, condition, price: parseFloat(price), note, status: 'active' };
        onAddAlert(newAlert);
        onClose();
    };
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60]">
            <div className="bg-gray-900/80 border border-white/20 rounded-2xl p-6 max-w-sm w-full text-white relative shadow-2xl shadow-blue-500/10">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-all"><X size={20} /></button>
                <h3 className="text-xl font-semibold mb-4">Create Alert for {coin.symbol}</h3>
                <p className="text-sm text-gray-400 mb-6">Current Price: <span className="font-mono text-white">${coin.price.toLocaleString()}</span></p>
                <form onSubmit={handleCreateAlert} className="space-y-4">
                    <div> <label className="block text-sm font-medium text-gray-300 mb-1">Condition</label> <select value={condition} onChange={(e) => setCondition(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition" > <option value="above">Price rises above</option> <option value="below">Price falls below</option> </select> </div><div> <label className="block text-sm font-medium text-gray-300 mb-1">Price</label> <div className="relative"> <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span> <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg pl-7 pr-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition" required /> </div></div><div> <label className="block text-sm font-medium text-gray-300 mb-1">Note (Optional)</label> <input type="text" placeholder="e.g., Check for breakout" value={note} onChange={(e) => setNote(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition" /> </div>
                    <div className="pt-4"><button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg py-2.5 text-sm font-semibold transition-all">Set Alert</button></div>
                </form>
            </div>
        </div>
    );
};
const AlertsListModal = ({ isOpen, onClose, alerts, onCreateNew, onDeleteAlert }) => {
    if (!isOpen) return null;
    const activeAlerts = alerts.filter(a => a.status === 'active');
    const triggeredAlerts = alerts.filter(a => a.status === 'triggered');
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-900/80 border border-white/20 rounded-2xl p-6 max-w-lg w-full text-white relative shadow-2xl shadow-blue-500/10 flex flex-col max-h-[80vh]">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-all"><X size={20} /></button>
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
                    <h3 className="text-xl font-semibold">Your Alerts</h3>
                    <button onClick={onCreateNew} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all flex items-center gap-2 text-sm font-semibold"><Plus size={16} /> Create New Alert</button>
                </div>
                <div className="flex-grow overflow-y-auto pr-2">
                    {alerts.length === 0 ? (<p className="text-gray-400 text-center py-8">You have no alerts set.</p>) : (
                        <>
                            <h4 className="text-sm font-semibold text-gray-400 mb-2">Active ({activeAlerts.length})</h4>
                            <div className="space-y-2 mb-6">{activeAlerts.map(alert => (<div key={alert.id} className="bg-white/5 rounded-lg p-3 flex items-center justify-between"><div><p className="font-semibold">{alert.symbol} <span className="text-gray-400 font-normal">crosses {alert.condition}</span> ${alert.price.toLocaleString()}</p>{alert.note && <p className="text-xs text-gray-500 mt-1">Note: {alert.note}</p>}</div><button onClick={() => onDeleteAlert(alert.id)} className="text-gray-500 hover:text-red-400 p-2"><Trash2 size={16} /></button></div>))}</div>
                            <h4 className="text-sm font-semibold text-gray-400 mb-2">Triggered ({triggeredAlerts.length})</h4>
                            <div className="space-y-2">{triggeredAlerts.map(alert => (<div key={alert.id} className="bg-white/5 rounded-lg p-3 flex items-center justify-between opacity-60"><div><p className="font-semibold flex items-center gap-2"><BellRing size={16} className="text-yellow-400" /> {alert.symbol} <span className="text-gray-400 font-normal">crossed {alert.condition}</span> ${alert.price.toLocaleString()}</p></div><button onClick={() => onDeleteAlert(alert.id)} className="text-gray-500 hover:text-red-400 p-2"><Trash2 size={16} /></button></div>))}</div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

// --- Main Page Component ---
export default function MarketAnalysisPage() {
    const watchlist = useRealTimeWatchlist();
    const [selectedCoin, setSelectedCoin] = useState(null);
    const marketData = useMarketData(selectedCoin);
    const [alerts, setAlerts] = useState([]);
    const [isAlertListOpen, setAlertListOpen] = useState(false);
    const [isCreateAlertOpen, setCreateAlertOpen] = useState(false);
    
    // NEW: State to manage audio interaction
    const [audioEnabled, setAudioEnabled] = useState(false);
    
    useEffect(() => { const savedAlerts = localStorage.getItem('crypto_alerts'); if (savedAlerts) setAlerts(JSON.parse(savedAlerts)); }, []);
    useEffect(() => { localStorage.setItem('crypto_alerts', JSON.stringify(alerts)); }, [alerts]);

    // MODIFIED: Effect hook to check alerts and play sound conditionally
    useEffect(() => {
        if (watchlist.length === 0 || alerts.length === 0) return;
        const activeAlerts = alerts.filter(a => a.status === 'active');
        if (activeAlerts.length === 0) return;

        let alertsUpdated = false;
        const updatedAlerts = alerts.map(alert => {
            if (alert.status !== 'active') return alert;
            const currentCoin = watchlist.find(c => c.symbol === alert.symbol);
            if (!currentCoin) return alert;

            const conditionMet = (alert.condition === 'above' && currentCoin.price >= alert.price) || (alert.condition === 'below' && currentCoin.price <= alert.price);

            if (conditionMet) {
                console.log(`Alert Triggered: ${alert.symbol} at $${currentCoin.price}`);
                // Only play sound if user has interacted with the page
                if (audioEnabled) {
                    const audio = new Audio('/alert-beep.mp3');
                    audio.play().catch(e => console.error("Error playing sound:", e));
                } else {
                    console.log("Audio not enabled by user. Skipping sound.");
                }
                alertsUpdated = true;
                return { ...alert, status: 'triggered' };
            }
            return alert;
        });
        if (alertsUpdated) setAlerts(updatedAlerts);
    }, [watchlist, alerts, audioEnabled]); // Added audioEnabled to dependency array

    const handleAddAlert = (newAlert) => { setAlerts(prevAlerts => [...prevAlerts, newAlert]); alert(`Alert for ${newAlert.symbol} has been set!`); };
    const handleDeleteAlert = (id) => { setAlerts(prevAlerts => prevAlerts.filter(a => a.id !== id)); };
    const openCreateAlertFlow = () => { setAlertListOpen(false); setCreateAlertOpen(true); };
    const handleExport = () => { if (!selectedCoin || !marketData) { alert("Please select a coin to export data."); return; } let csvContent = "data:text/csv;charset=utf-8,"; csvContent += "Category,Value\r\n"; csvContent += `Symbol,${selectedCoin.symbol}\r\n`; csvContent += `24h High,${marketData.high}\r\n`; csvContent += `24h Low,${marketData.low}\r\n`; csvContent += `24h Volume,${selectedCoin.volume}\r\n`; csvContent += `Market Cap,"${marketData.marketCap}"\r\n`; csvContent += "\r\n"; csvContent += "Order Book\r\n"; csvContent += "Type,Price,Amount\r\n"; marketData.orderBook.asks.forEach(ask => { csvContent += `ASK,${ask.price},${ask.amount}\r\n`; }); marketData.orderBook.bids.forEach(bid => { csvContent += `BID,${bid.price},${bid.amount}\r\n`; }); const encodedUri = encodeURI(csvContent); const link = document.createElement("a"); link.setAttribute("href", encodedUri); link.setAttribute("download", `${selectedCoin.symbol}_market_data.csv`); document.body.appendChild(link); link.click(); document.body.removeChild(link); };
    useEffect(() => { if (watchlist.length > 0 && !selectedCoin) { setSelectedCoin(watchlist[0]); } }, [watchlist, selectedCoin]);
    const activeAlertCount = alerts.filter(a => a.status === 'active').length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-gray-950 text-white font-sans">
            
            {/* NEW: Button to enable audio, disappears after click */}
            {!audioEnabled && (
                <div className="fixed bottom-4 right-4 z-[100]">
                    <button 
                        onClick={() => setAudioEnabled(true)}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg shadow-lg text-white font-semibold flex items-center gap-2 animate-pulse"
                    >
                        <BellRing size={16} /> Enable Sound for Alerts
                    </button>
                </div>
            )}

            <Header onAlertClick={() => setAlertListOpen(true)} onExportClick={handleExport} alertCount={activeAlertCount} />
            <main className="max-w-[1920px] mx-auto p-4 lg:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <aside className="lg:col-span-2"><Watchlist watchlistData={watchlist} selectedSymbol={selectedCoin ? selectedCoin.symbol : ''} onSymbolSelect={setSelectedCoin} /></aside>
                    <section className="lg:col-span-7">{selectedCoin && (<><TradingViewChart symbol={selectedCoin.symbol} /><TechnicalIndicators selectedCoin={selectedCoin} /></>)}</section>
                    <aside className="lg:col-span-3">{selectedCoin && <MarketData selectedCoin={selectedCoin} marketData={marketData} />}</aside>
                </div>
            </main>
            <AlertsListModal isOpen={isAlertListOpen} onClose={() => setAlertListOpen(false)} alerts={alerts} onCreateNew={openCreateAlertFlow} onDeleteAlert={handleDeleteAlert} />
            <CreateAlertModal isOpen={isCreateAlertOpen} onClose={() => setCreateAlertOpen(false)} coin={selectedCoin} onAddAlert={handleAddAlert} />
        </div>
    );
}