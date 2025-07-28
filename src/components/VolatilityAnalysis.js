import React from 'react';
import { useSelector } from 'react-redux';
import { Activity, TrendingUp, AlertTriangle, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const VolatilityAnalysis = () => {
  const { selectedSymbol, marketData } = useSelector(state => state.marketData);
  const data = marketData[selectedSymbol]?.data || [];

  // Calculate volatility metrics
  const calculateVolatilityMetrics = () => {
    if (data.length === 0) return {};
    
    const volatilities = data.map(day => day.volatility);
    const avgVolatility = volatilities.reduce((sum, vol) => sum + vol, 0) / volatilities.length;
    const maxVolatility = Math.max(...volatilities);
    const minVolatility = Math.min(...volatilities);
    const volatilityStd = Math.sqrt(volatilities.reduce((sum, vol) => sum + Math.pow(vol - avgVolatility, 2), 0) / volatilities.length);
    
    // Calculate VIX-like metric
    const vixValues = data.map(day => day.vix);
    const avgVix = vixValues.reduce((sum, vix) => sum + vix, 0) / vixValues.length;
    
    return {
      avgVolatility: (avgVolatility * 100).toFixed(2),
      maxVolatility: (maxVolatility * 100).toFixed(2),
      minVolatility: (minVolatility * 100).toFixed(2),
      volatilityStd: (volatilityStd * 100).toFixed(2),
      avgVix: avgVix.toFixed(2),
      highVolatilityDays: volatilities.filter(v => v > avgVolatility * 1.5).length,
      lowVolatilityDays: volatilities.filter(v => v < avgVolatility * 0.5).length,
      extremeVolatilityDays: volatilities.filter(v => v > avgVolatility * 2).length,
    };
  };

  const metrics = calculateVolatilityMetrics();

  // Prepare chart data
  const chartData = data.slice(-30).map(day => ({
    date: new Date(day.date).toLocaleDateString(),
    volatility: (day.volatility * 100).toFixed(2),
    vix: day.vix.toFixed(2),
    avgVolatility: (parseFloat(metrics.avgVolatility)).toFixed(2),
  }));

  // Volatility distribution
  const volatilityDistribution = [
    { range: 'Very Low', count: data.filter(day => day.volatility < parseFloat(metrics.avgVolatility) / 100 * 0.5).length },
    { range: 'Low', count: data.filter(day => day.volatility >= parseFloat(metrics.avgVolatility) / 100 * 0.5 && day.volatility < parseFloat(metrics.avgVolatility) / 100).length },
    { range: 'Normal', count: data.filter(day => day.volatility >= parseFloat(metrics.avgVolatility) / 100 && day.volatility < parseFloat(metrics.avgVolatility) / 100 * 1.5).length },
    { range: 'High', count: data.filter(day => day.volatility >= parseFloat(metrics.avgVolatility) / 100 * 1.5 && day.volatility < parseFloat(metrics.avgVolatility) / 100 * 2).length },
    { range: 'Extreme', count: data.filter(day => day.volatility >= parseFloat(metrics.avgVolatility) / 100 * 2).length },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Volatility Analysis</h2>
        <div className="text-sm text-gray-500">{selectedSymbol}</div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg Volatility</p>
              <p className="text-lg font-semibold text-gray-900">{metrics.avgVolatility}%</p>
            </div>
            <Activity className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Max Volatility</p>
              <p className="text-lg font-semibold text-red-600">{metrics.maxVolatility}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg VIX</p>
              <p className="text-lg font-semibold text-gray-900">{metrics.avgVix}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Volatility Std</p>
              <p className="text-lg font-semibold text-gray-900">{metrics.volatilityStd}%</p>
            </div>
            <Target className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Volatility Chart */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Volatility Trend (Last 30 Days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="volatility" 
              stroke="#EF4444" 
              strokeWidth={2}
              dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="vix" 
              stroke="#8B5CF6" 
              strokeWidth={2}
              strokeDasharray="5 5"
            />
            <Line 
              type="monotone" 
              dataKey="avgVolatility" 
              stroke="#3B82F6" 
              strokeWidth={2}
              strokeDasharray="3 3"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Volatility Distribution */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Volatility Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={volatilityDistribution}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#EF4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Volatility Statistics */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Volatility Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-md font-medium text-gray-700 mb-3">Volatility Patterns</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">High Volatility Days</span>
                <span className="font-semibold text-orange-600">{metrics.highVolatilityDays}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Low Volatility Days</span>
                <span className="font-semibold text-green-600">{metrics.lowVolatilityDays}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Extreme Volatility Days</span>
                <span className="font-semibold text-red-600">{metrics.extremeVolatilityDays}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-md font-medium text-gray-700 mb-3">Volatility Metrics</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Min Volatility</span>
                <span className="font-semibold text-gray-900">{metrics.minVolatility}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Volatility Range</span>
                <span className="font-semibold text-gray-900">
                  {(parseFloat(metrics.maxVolatility) - parseFloat(metrics.minVolatility)).toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Normal Volatility Days</span>
                <span className="font-semibold text-gray-900">
                  {data.length - metrics.highVolatilityDays - metrics.lowVolatilityDays - metrics.extremeVolatilityDays}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg border ${
            parseFloat(metrics.avgVolatility) < 20 ? 'bg-green-50 border-green-200' : 
            parseFloat(metrics.avgVolatility) < 40 ? 'bg-yellow-50 border-yellow-200' : 
            'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Risk Level</span>
              <span className={`text-sm font-semibold ${
                parseFloat(metrics.avgVolatility) < 20 ? 'text-green-600' : 
                parseFloat(metrics.avgVolatility) < 40 ? 'text-yellow-600' : 
                'text-red-600'
              }`}>
                {parseFloat(metrics.avgVolatility) < 20 ? 'Low' : 
                 parseFloat(metrics.avgVolatility) < 40 ? 'Medium' : 'High'}
              </span>
            </div>
            <p className="text-xs text-gray-600">
              Based on average volatility of {metrics.avgVolatility}%
            </p>
          </div>

          <div className={`p-4 rounded-lg border ${
            parseFloat(metrics.avgVix) < 20 ? 'bg-green-50 border-green-200' : 
            parseFloat(metrics.avgVix) < 30 ? 'bg-yellow-50 border-yellow-200' : 
            'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Market Fear</span>
              <span className={`text-sm font-semibold ${
                parseFloat(metrics.avgVix) < 20 ? 'text-green-600' : 
                parseFloat(metrics.avgVix) < 30 ? 'text-yellow-600' : 
                'text-red-600'
              }`}>
                {parseFloat(metrics.avgVix) < 20 ? 'Low' : 
                 parseFloat(metrics.avgVix) < 30 ? 'Medium' : 'High'}
              </span>
            </div>
            <p className="text-xs text-gray-600">
              VIX average: {metrics.avgVix}
            </p>
          </div>

          <div className={`p-4 rounded-lg border ${
            metrics.extremeVolatilityDays < 5 ? 'bg-green-50 border-green-200' : 
            metrics.extremeVolatilityDays < 10 ? 'bg-yellow-50 border-yellow-200' : 
            'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Stability</span>
              <span className={`text-sm font-semibold ${
                metrics.extremeVolatilityDays < 5 ? 'text-green-600' : 
                metrics.extremeVolatilityDays < 10 ? 'text-yellow-600' : 
                'text-red-600'
              }`}>
                {metrics.extremeVolatilityDays < 5 ? 'Stable' : 
                 metrics.extremeVolatilityDays < 10 ? 'Moderate' : 'Unstable'}
              </span>
            </div>
            <p className="text-xs text-gray-600">
              {metrics.extremeVolatilityDays} extreme volatility days
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolatilityAnalysis; 