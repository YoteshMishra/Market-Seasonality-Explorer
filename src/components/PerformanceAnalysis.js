import React from 'react';
import { useSelector } from 'react-redux';
import { TrendingUp, TrendingDown, Target, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PerformanceAnalysis = () => {
  const { selectedSymbol, marketData } = useSelector(state => state.marketData);
  const data = marketData[selectedSymbol]?.data || [];

  // Calculate performance metrics
  const calculateMetrics = () => {
    if (data.length === 0) return {};
    
    const returns = data.map(day => day.performance);
    const totalReturn = returns.reduce((sum, ret) => sum + ret, 0);
    const avgReturn = totalReturn / returns.length;
    const maxReturn = Math.max(...returns);
    const minReturn = Math.min(...returns);
    const volatility = Math.sqrt(returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / returns.length);
    
    return {
      totalReturn: (totalReturn * 100).toFixed(2),
      avgReturn: (avgReturn * 100).toFixed(2),
      maxReturn: (maxReturn * 100).toFixed(2),
      minReturn: (minReturn * 100).toFixed(2),
      volatility: (volatility * 100).toFixed(2),
      sharpeRatio: avgReturn / volatility,
      positiveDays: returns.filter(r => r > 0).length,
      negativeDays: returns.filter(r => r < 0).length,
    };
  };

  const metrics = calculateMetrics();

  // Prepare chart data
  const chartData = data.slice(-30).map(day => ({
    date: new Date(day.date).toLocaleDateString(),
    return: (day.performance * 100).toFixed(2),
    cumulative: ((day.performance + 1) * 100).toFixed(2),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Performance Analysis</h2>
        <div className="text-sm text-gray-500">{selectedSymbol}</div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Return</p>
              <p className={`text-lg font-semibold ${parseFloat(metrics.totalReturn) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {metrics.totalReturn}%
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg Return</p>
              <p className={`text-lg font-semibold ${parseFloat(metrics.avgReturn) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {metrics.avgReturn}%
              </p>
            </div>
            <Target className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Volatility</p>
              <p className="text-lg font-semibold text-gray-900">{metrics.volatility}%</p>
            </div>
            <BarChart3 className="w-8 h-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Sharpe Ratio</p>
              <p className="text-lg font-semibold text-gray-900">{metrics.sharpeRatio?.toFixed(2) || 'N/A'}</p>
            </div>
            <TrendingDown className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Returns (Last 30 Days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="return" 
              stroke="#3B82F6" 
              strokeWidth={2}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Return Distribution */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Return Distribution</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-md font-medium text-gray-700 mb-3">Positive vs Negative Days</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Positive Days</span>
                <span className="font-semibold text-green-600">{metrics.positiveDays}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Negative Days</span>
                <span className="font-semibold text-red-600">{metrics.negativeDays}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Win Rate</span>
                <span className="font-semibold text-gray-900">
                  {data.length > 0 ? ((metrics.positiveDays / data.length) * 100).toFixed(1) : 0}%
                </span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-md font-medium text-gray-700 mb-3">Extreme Returns</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Best Day</span>
                <span className="font-semibold text-green-600">+{metrics.maxReturn}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Worst Day</span>
                <span className="font-semibold text-red-600">{metrics.minReturn}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Range</span>
                <span className="font-semibold text-gray-900">
                  {(parseFloat(metrics.maxReturn) - parseFloat(metrics.minReturn)).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceAnalysis; 