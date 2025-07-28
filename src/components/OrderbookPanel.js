import React, { useEffect, useState } from 'react';

const SYMBOLS = [
  { label: 'BTC/USDT', value: 'BTCUSDT' },
  { label: 'ETH/USDT', value: 'ETHUSDT' },
  { label: 'BNB/USDT', value: 'BNBUSDT' },
  { label: 'SOL/USDT', value: 'SOLUSDT' },
  { label: 'ADA/USDT', value: 'ADAUSDT' },
];
const ROW_OPTIONS = [10, 20, 50];

const getApiUrl = (symbol, limit) => `https://api.binance.com/api/v3/depth?symbol=${symbol}&limit=${limit}`;

const OrderbookPanel = () => {
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [rowCount, setRowCount] = useState(10);
  const [orderbook, setOrderbook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch orderbook data
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    fetch(getApiUrl(symbol, rowCount))
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch orderbook');
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          setOrderbook(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      });
    return () => { isMounted = false; };
  }, [symbol, rowCount, refreshKey]);

  // Auto-refresh every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => setRefreshKey((k) => k + 1), 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card p-4 mb-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
        <h3 className="text-lg font-semibold">Orderbook (Binance)</h3>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={symbol}
            onChange={e => setSymbol(e.target.value)}
            className="px-2 py-1 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {SYMBOLS.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <select
            value={rowCount}
            onChange={e => setRowCount(Number(e.target.value))}
            className="px-2 py-1 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {ROW_OPTIONS.map(n => (
              <option key={n} value={n}>{n} rows</option>
            ))}
          </select>
          <button
            onClick={() => setRefreshKey(k => k + 1)}
            className="px-2 py-1 text-xs rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            title="Refresh"
          >
            Refresh
          </button>
        </div>
      </div>
      {loading && <div className="text-gray-500">Loading...</div>}
      {error && (
        <div className="text-red-600 flex items-center gap-2">
          <span>Error: {error}</span>
          <button
            onClick={() => setRefreshKey(k => k + 1)}
            className="px-2 py-1 text-xs rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
          >Retry</button>
        </div>
      )}
      {orderbook && (
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs sm:text-sm">
            <thead>
              <tr>
                <th className="px-2 py-1 text-left text-green-700">Bid Price</th>
                <th className="px-2 py-1 text-left text-green-700">Bid Qty</th>
                <th className="px-2 py-1 text-left text-red-700">Ask Price</th>
                <th className="px-2 py-1 text-left text-red-700">Ask Qty</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: rowCount }).map((_, i) => (
                <tr key={i}>
                  <td className="px-2 py-1 text-green-700 font-mono">
                    {orderbook.bids[i] ? orderbook.bids[i][0] : ''}
                  </td>
                  <td className="px-2 py-1 text-green-700 font-mono">
                    {orderbook.bids[i] ? orderbook.bids[i][1] : ''}
                  </td>
                  <td className="px-2 py-1 text-red-700 font-mono">
                    {orderbook.asks[i] ? orderbook.asks[i][0] : ''}
                  </td>
                  <td className="px-2 py-1 text-red-700 font-mono">
                    {orderbook.asks[i] ? orderbook.asks[i][1] : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderbookPanel; 