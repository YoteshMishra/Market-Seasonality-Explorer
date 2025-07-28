import React from 'react';
import { useSelector } from 'react-redux';
import { BarChart3, TrendingUp, Activity, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from 'recharts';

const VolumeAnalysis = () => {
  const { selectedSymbol, marketData } = useSelector(state => state.marketData);
  const data = marketData[selectedSymbol]?.data || [];

  // Calculate volume metrics
  const calculateVolumeMetrics = () => {
    if (data.length === 0) return {};
    
    const volumes = data.map(day => day.volume);
    const totalVolume = volumes.reduce((sum, vol) => sum + vol, 0);
    const avgVolume = totalVolume / volumes.length;
    const maxVolume = Math.max(...volumes);
    const minVolume = Math.min(...volumes);
    const volumeVolatility = Math.sqrt(volumes.reduce((sum, vol) => sum + Math.pow(vol - avgVolume, 2), 0) / volumes.length);
    
    // Calculate volume-weighted average price
    const vwap = data.reduce((sum, day) => sum + (day.close * day.volume), 0) / totalVolume;
    
    return {
      totalVolume: (totalVolume / 1000000).toFixed(2),
      avgVolume: (avgVolume / 1000000).toFixed(2),
      maxVolume: (maxVolume / 1000000).toFixed(2),
      minVolume: (minVolume / 1000000).toFixed(2),
      volumeVolatility: (volumeVolatility / 1000000).toFixed(2),
      vwap: vwap.toFixed(2),
      highVolumeDays: volumes.filter(v => v > avgVolume * 1.5).length,
      lowVolumeDays: volumes.filter(v => v < avgVolume * 0.5).length,
    };
  };

  const metrics = calculateVolumeMetrics();

  // Prepare chart data
  const chartData = data.slice(-30).map(day => ({
    date: new Date(day.date).toLocaleDateString(),
    volume: (day.volume / 1000000).toFixed(2),
    price: day.close.toFixed(2),
    avgVolume: (parseFloat(metrics.avgVolume)).toFixed(2),
  }));

  // Volume distribution
  const volumeDistribution = [
    { range: 'Very Low', count: data.filter(day => day.volume < parseFloat(metrics.avgVolume) * 0.5).length },
    { range: 'Low', count: data.filter(day => day.volume >= parseFloat(metrics.avgVolume) * 0.5 && day.volume < parseFloat(metrics.avgVolume)).length },
    { range: 'Normal', count: data.filter(day => day.volume >= parseFloat(metrics.avgVolume) && day.volume < parseFloat(metrics.avgVolume) * 1.5).length },
    { range: 'High', count: data.filter(day => day.volume >= parseFloat(metrics.avgVolume) * 1.5 && day.volume < parseFloat(metrics.avgVolume) * 2).length },
    { range: 'Very High', count: data.filter(day => day.volume >= parseFloat(metrics.avgVolume) * 2).length },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Volume Analysis</h2>
        <div className="text-sm text-gray-500">{selectedSymbol}</div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Volume</p>
              <p className="text-lg font-semibold text-gray-900">{metrics.totalVolume}M</p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg Volume</p>
              <p className="text-lg font-semibold text-gray-900">{metrics.avgVolume}M</p>
            </div>
            <Target className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Max Volume</p>
              <p className="text-lg font-semibold text-gray-900">{metrics.maxVolume}M</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">VWAP</p>
              <p className="text-lg font-semibold text-gray-900">${metrics.vwap}</p>
            </div>
            <Activity className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Volume Chart */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Volume Trend (Last 30 Days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="volume" fill="#3B82F6" opacity={0.8} />
            <Line 
              type="monotone" 
              dataKey="avgVolume" 
              stroke="#EF4444" 
              strokeWidth={2}
              strokeDasharray="5 5"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Volume Distribution */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Volume Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={volumeDistribution}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Volume Statistics */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Volume Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-md font-medium text-gray-700 mb-3">Volume Patterns</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">High Volume Days</span>
                <span className="font-semibold text-orange-600">{metrics.highVolumeDays}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Low Volume Days</span>
                <span className="font-semibold text-blue-600">{metrics.lowVolumeDays}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Normal Volume Days</span>
                <span className="font-semibold text-gray-900">
                  {data.length - metrics.highVolumeDays - metrics.lowVolumeDays}
                </span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-md font-medium text-gray-700 mb-3">Volume Metrics</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Min Volume</span>
                <span className="font-semibold text-gray-900">{metrics.minVolume}M</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Volume Volatility</span>
                <span className="font-semibold text-gray-900">{metrics.volumeVolatility}M</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Volume Range</span>
                <span className="font-semibold text-gray-900">
                  {(parseFloat(metrics.maxVolume) - parseFloat(metrics.minVolume)).toFixed(2)}M
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolumeAnalysis; 