import React from 'react';
import { useSelector } from 'react-redux';
import { Eye, TrendingUp, TrendingDown, Target, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PatternRecognition = () => {
  const { selectedSymbol, marketData } = useSelector(state => state.marketData);
  const data = marketData[selectedSymbol]?.data || [];

  // Calculate technical indicators and patterns
  const calculatePatterns = () => {
    if (data.length < 20) return {};
    
    const prices = data.map(day => day.close);
    const volumes = data.map(day => day.volume);
    const rsiValues = data.map(day => day.rsi);
    
    // Moving averages
    const ma20 = data.map(day => day.movingAverage20);
    const ma50 = data.map(day => day.movingAverage50);
    
    // Pattern detection
    const patterns = {
      // Trend patterns
      uptrend: prices.slice(-5).every((price, i) => i === 0 || price >= prices.slice(-5)[i-1]),
      downtrend: prices.slice(-5).every((price, i) => i === 0 || price <= prices.slice(-5)[i-1]),
      
      // Support/Resistance levels
      supportLevel: Math.min(...prices.slice(-10)),
      resistanceLevel: Math.max(...prices.slice(-10)),
      
      // Volume patterns
      volumeSpike: volumes.slice(-1)[0] > volumes.slice(-20, -1).reduce((a, b) => a + b, 0) / 19 * 2,
      
      // RSI patterns
      rsiOversold: rsiValues.slice(-1)[0] < 30,
      rsiOverbought: rsiValues.slice(-1)[0] > 70,
      
      // Moving average patterns
      goldenCross: ma20.slice(-1)[0] > ma50.slice(-1)[0] && ma20.slice(-2)[0] <= ma50.slice(-2)[0],
      deathCross: ma20.slice(-1)[0] < ma50.slice(-1)[0] && ma20.slice(-2)[0] >= ma50.slice(-2)[0],
      
      // Price action patterns
      higherHighs: prices.slice(-3).every((price, i) => i === 0 || price > prices.slice(-3)[i-1]),
      lowerLows: prices.slice(-3).every((price, i) => i === 0 || price < prices.slice(-3)[i-1]),
    };
    
    return patterns;
  };

  const patterns = calculatePatterns();

  // Prepare chart data
  const chartData = data.slice(-30).map((day, index) => ({
    date: new Date(day.date).toLocaleDateString(),
    price: day.close.toFixed(2),
    ma20: day.movingAverage20.toFixed(2),
    ma50: day.movingAverage50.toFixed(2),
    rsi: day.rsi.toFixed(2),
    volume: (day.volume / 1000000).toFixed(2),
  }));

  // Pattern signals
  const getPatternSignals = () => {
    const signals = [];
    
    if (patterns.uptrend) signals.push({ type: 'bullish', pattern: 'Uptrend', confidence: 'High' });
    if (patterns.downtrend) signals.push({ type: 'bearish', pattern: 'Downtrend', confidence: 'High' });
    if (patterns.goldenCross) signals.push({ type: 'bullish', pattern: 'Golden Cross', confidence: 'Medium' });
    if (patterns.deathCross) signals.push({ type: 'bearish', pattern: 'Death Cross', confidence: 'Medium' });
    if (patterns.rsiOversold) signals.push({ type: 'bullish', pattern: 'RSI Oversold', confidence: 'Medium' });
    if (patterns.rsiOverbought) signals.push({ type: 'bearish', pattern: 'RSI Overbought', confidence: 'Medium' });
    if (patterns.volumeSpike) signals.push({ type: 'neutral', pattern: 'Volume Spike', confidence: 'Low' });
    if (patterns.higherHighs) signals.push({ type: 'bullish', pattern: 'Higher Highs', confidence: 'Low' });
    if (patterns.lowerLows) signals.push({ type: 'bearish', pattern: 'Lower Lows', confidence: 'Low' });
    
    return signals;
  };

  const signals = getPatternSignals();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Pattern Recognition</h2>
        <div className="text-sm text-gray-500">{selectedSymbol}</div>
      </div>

      {/* Pattern Signals */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detected Patterns</h3>
        {signals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {signals.map((signal, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  signal.type === 'bullish' ? 'bg-green-50 border-green-200' :
                  signal.type === 'bearish' ? 'bg-red-50 border-red-200' :
                  'bg-yellow-50 border-yellow-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{signal.pattern}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    signal.type === 'bullish' ? 'bg-green-100 text-green-800' :
                    signal.type === 'bearish' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {signal.type.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Confidence</span>
                  <span className={`text-xs font-semibold ${
                    signal.confidence === 'High' ? 'text-green-600' :
                    signal.confidence === 'Medium' ? 'text-yellow-600' :
                    'text-gray-600'
                  }`}>
                    {signal.confidence}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Eye className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No significant patterns detected</p>
          </div>
        )}
      </div>

      {/* Technical Analysis Chart */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Analysis (Last 30 Days)</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#3B82F6" 
              strokeWidth={3}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              name="Price"
            />
            <Line 
              type="monotone" 
              dataKey="ma20" 
              stroke="#10B981" 
              strokeWidth={2}
              strokeDasharray="5 5"
              name="MA20"
            />
            <Line 
              type="monotone" 
              dataKey="ma50" 
              stroke="#F59E0B" 
              strokeWidth={2}
              strokeDasharray="3 3"
              name="MA50"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* RSI Chart */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">RSI Indicator</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="rsi" 
              stroke="#8B5CF6" 
              strokeWidth={2}
              dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 3 }}
            />
            <Line 
              type="monotone" 
              dataKey="70" 
              stroke="#EF4444" 
              strokeWidth={1}
              strokeDasharray="5 5"
              name="Overbought"
            />
            <Line 
              type="monotone" 
              dataKey="30" 
              stroke="#10B981" 
              strokeWidth={1}
              strokeDasharray="5 5"
              name="Oversold"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Support and Resistance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Support & Resistance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
              <div>
                <p className="text-sm font-medium text-red-700">Resistance Level</p>
                <p className="text-xs text-red-600">Strong selling pressure</p>
              </div>
              <span className="text-lg font-semibold text-red-700">${patterns.resistanceLevel?.toFixed(2) || 'N/A'}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div>
                <p className="text-sm font-medium text-green-700">Support Level</p>
                <p className="text-xs text-green-600">Strong buying pressure</p>
              </div>
              <span className="text-lg font-semibold text-green-700">${patterns.supportLevel?.toFixed(2) || 'N/A'}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div>
                <p className="text-sm font-medium text-blue-700">Current Price</p>
                <p className="text-xs text-blue-600">Latest closing price</p>
              </div>
              <span className="text-lg font-semibold text-blue-700">
                ${data.length > 0 ? data[data.length - 1].close.toFixed(2) : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Market Sentiment */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Sentiment</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Trend Direction</span>
              <div className="flex items-center space-x-2">
                {patterns.uptrend ? (
                  <>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-semibold text-green-600">Bullish</span>
                  </>
                ) : patterns.downtrend ? (
                  <>
                    <TrendingDown className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-semibold text-red-600">Bearish</span>
                  </>
                ) : (
                  <>
                    <Target className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-semibold text-gray-600">Sideways</span>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">RSI Status</span>
              <div className="flex items-center space-x-2">
                {patterns.rsiOversold ? (
                  <>
                    <AlertTriangle className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-semibold text-green-600">Oversold</span>
                  </>
                ) : patterns.rsiOverbought ? (
                  <>
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-semibold text-red-600">Overbought</span>
                  </>
                ) : (
                  <>
                    <Target className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-semibold text-gray-600">Neutral</span>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Volume Activity</span>
              <div className="flex items-center space-x-2">
                {patterns.volumeSpike ? (
                  <>
                    <TrendingUp className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-semibold text-orange-600">High</span>
                  </>
                ) : (
                  <>
                    <Target className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-semibold text-gray-600">Normal</span>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">MA Cross</span>
              <div className="flex items-center space-x-2">
                {patterns.goldenCross ? (
                  <>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-semibold text-green-600">Golden Cross</span>
                  </>
                ) : patterns.deathCross ? (
                  <>
                    <TrendingDown className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-semibold text-red-600">Death Cross</span>
                  </>
                ) : (
                  <>
                    <Target className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-semibold text-gray-600">No Cross</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trading Recommendations */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Trading Recommendations</h3>
        <div className="space-y-3">
          {signals.filter(s => s.confidence === 'High' || s.confidence === 'Medium').length > 0 ? (
            signals
              .filter(s => s.confidence === 'High' || s.confidence === 'Medium')
              .map((signal, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {signal.type === 'bullish' ? (
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-500" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {signal.type === 'bullish' ? 'Consider Buying' : 'Consider Selling'}
                      </p>
                      <p className="text-xs text-gray-500">Based on {signal.pattern} pattern</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    signal.confidence === 'High' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {signal.confidence} Confidence
                  </span>
                </div>
              ))
          ) : (
            <div className="text-center py-6 text-gray-500">
              <Target className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>No strong trading signals at this time</p>
              <p className="text-xs">Monitor for pattern developments</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatternRecognition; 