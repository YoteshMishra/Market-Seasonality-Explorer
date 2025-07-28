import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { TrendingUp, TrendingDown, Activity, BarChart3, DollarSign, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Dashboard = () => {
  const { selectedDate } = useSelector(state => state.calendar);
  const { marketData, selectedSymbol, isLoading } = useSelector(state => state.marketData);

  const symbolData = useMemo(() => marketData[selectedSymbol]?.data || [], [marketData, selectedSymbol]);
  const selectedDateData = symbolData.find(day => 
    selectedDate && day.date === format(selectedDate, 'yyyy-MM-dd')
  );

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    if (!symbolData.length) return null;

    const prices = symbolData.map(day => day.close);
    const volumes = symbolData.map(day => day.volume);
    const volatilities = symbolData.map(day => day.volatility);
    const performances = symbolData.map(day => day.performance);

    return {
      avgPrice: prices.reduce((sum, price) => sum + price, 0) / prices.length,
      avgVolume: volumes.reduce((sum, volume) => sum + volume, 0) / volumes.length,
      avgVolatility: volatilities.reduce((sum, vol) => sum + vol, 0) / volatilities.length,
      totalReturn: performances.reduce((sum, perf) => sum + perf, 0),
      maxPrice: Math.max(...prices),
      minPrice: Math.min(...prices),
      maxVolume: Math.max(...volumes),
      minVolume: Math.min(...volumes),
    };
  }, [symbolData]);

  // Prepare chart data
  const chartData = useMemo(() => {
    return symbolData.slice(-30).map(day => ({
      date: format(new Date(day.date), 'MM/dd'),
      price: day.close,
      volume: day.volume / 1000000, // Convert to millions
      volatility: day.volatility * 100, // Convert to percentage
      performance: day.performance * 100, // Convert to percentage
    }));
  }, [symbolData]);

  const StatCard = ({ title, value, change, icon: Icon, color = 'blue' }) => (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <div className={`flex items-center text-sm ${
              change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {change >= 0 ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )}
              {Math.abs(change).toFixed(2)}%
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Selected Date Details */}
      {selectedDateData && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {format(selectedDate, 'MMMM dd, yyyy')} - {selectedSymbol}
          </h3>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Open</span>
                <span className="font-medium">${selectedDateData.open.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">High</span>
                <span className="font-medium">${selectedDateData.high.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Low</span>
                <span className="font-medium">${selectedDateData.low.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Close</span>
                <span className="font-medium">${selectedDateData.close.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Volume</span>
                <span className="font-medium">{(selectedDateData.volume / 1000000).toFixed(2)}M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Volatility</span>
                <span className="font-medium">{(selectedDateData.volatility * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Performance</span>
                <span className={`font-medium ${
                  selectedDateData.performance >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {selectedDateData.performance >= 0 ? '+' : ''}
                  {(selectedDateData.performance * 100).toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">VIX</span>
                <span className="font-medium">{selectedDateData.vix.toFixed(1)}</span>
              </div>
            </div>
          </div>

          {/* Technical Indicators */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Technical Indicators</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">RSI</span>
                <div className="font-medium">{selectedDateData.rsi.toFixed(1)}</div>
              </div>
              <div>
                <span className="text-gray-600">MA20</span>
                <div className="font-medium">${selectedDateData.movingAverage20.toFixed(2)}</div>
              </div>
              <div>
                <span className="text-gray-600">MA50</span>
                <div className="font-medium">${selectedDateData.movingAverage50.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary Statistics */}
      {summaryStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard
            title="Average Price"
            value={`$${summaryStats.avgPrice.toFixed(2)}`}
            icon={DollarSign}
            color="green"
          />
          <StatCard
            title="Average Volume"
            value={`${(summaryStats.avgVolume / 1000000).toFixed(1)}M`}
            icon={BarChart3}
            color="blue"
          />
          <StatCard
            title="Average Volatility"
            value={`${(summaryStats.avgVolatility * 100).toFixed(1)}%`}
            icon={Activity}
            color="yellow"
          />
          <StatCard
            title="Total Return"
            value={`${(summaryStats.totalReturn * 100).toFixed(2)}%`}
            change={summaryStats.totalReturn * 100}
            icon={Target}
            color={summaryStats.totalReturn >= 0 ? 'green' : 'red'}
          />
        </div>
      )}

      {/* Price Chart */}
      {chartData.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Trend (Last 30 Days)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Volume Chart */}
      {chartData.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Volume Trend (Last 30 Days)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="volume" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Market Insights */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Insights</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <span className="text-green-700">Strong upward momentum</span>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
            <span className="text-yellow-700">Moderate volatility expected</span>
            <Activity className="w-4 h-4 text-yellow-600" />
          </div>
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <span className="text-blue-700">Above average trading volume</span>
            <BarChart3 className="w-4 h-4 text-blue-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 