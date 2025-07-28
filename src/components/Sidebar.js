import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Filter, TrendingUp, BarChart3, Activity, Target, Zap, Bell, Palette, Download, Settings, Eye } from 'lucide-react';
import { setSelectedSymbol, setFilters } from '../store/slices/marketDataSlice';
import { setSidebarOpen, openModal } from '../store/slices/uiSlice';

const Sidebar = () => {
  const dispatch = useDispatch();
  const { selectedSymbol, availableSymbols, filters } = useSelector(state => state.marketData);
  const { sidebarOpen } = useSelector(state => state.ui);

  const handleSymbolChange = (symbol) => {
    dispatch(setSelectedSymbol(symbol));
  };

  const handleFilterChange = (filterType, value) => {
    dispatch(setFilters({ [filterType]: value }));
  };

  const handleCloseSidebar = () => {
    dispatch(setSidebarOpen(false));
  };

  const handleOpenModal = (modalType) => {
    dispatch(openModal(modalType));
  };

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={handleCloseSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-64 max-w-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:z-auto`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Market Explorer</h2>
              <p className="text-sm text-gray-500 mt-1">Financial Data Analysis</p>
            </div>
            {/* Mobile Close Button */}
            <button
              className="lg:hidden ml-2 p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={handleCloseSidebar}
              aria-label="Close sidebar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Symbol Selection */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700 flex items-center">
                <Target className="w-4 h-4 mr-2" />
                Trading Symbol
              </h3>
              <div className="space-y-2">
                {availableSymbols.map((symbol) => (
                  <button
                    key={symbol}
                    onClick={() => handleSymbolChange(symbol)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedSymbol === symbol
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {symbol}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700 flex items-center">
                <Zap className="w-4 h-4 mr-2" />
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button 
                  onClick={() => handleOpenModal('export')}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </button>
                <button 
                  onClick={() => handleOpenModal('alerts')}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Alert System
                </button>
                <button 
                  onClick={() => handleOpenModal('theme')}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center"
                >
                  <Palette className="w-4 h-4 mr-2" />
                  Theme Settings
                </button>
                <button 
                  onClick={() => handleOpenModal('settings')}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </button>
              </div>
            </div>

            {/* Analysis Tools */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700 flex items-center">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analysis Tools
              </h3>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Performance Analysis
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Volume Analysis
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center">
                  <Activity className="w-4 h-4 mr-2" />
                  Volatility Analysis
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center">
                  <Eye className="w-4 h-4 mr-2" />
                  Pattern Recognition
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700 flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </h3>
              
              {/* Volatility Filter */}
              <div className="space-y-2">
                <label className="text-xs text-gray-500">Volatility Range</label>
                <div className="flex space-x-2">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={filters.volatilityRange[1]}
                    onChange={(e) => handleFilterChange('volatilityRange', [0, parseFloat(e.target.value)])}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-500">{filters.volatilityRange[1]}</span>
                </div>
              </div>

              {/* Volume Filter */}
              <div className="space-y-2">
                <label className="text-xs text-gray-500">Volume Range</label>
                <div className="flex space-x-2">
                  <input
                    type="range"
                    min="0"
                    max="1000000"
                    step="100000"
                    value={filters.volumeRange[1]}
                    onChange={(e) => handleFilterChange('volumeRange', [0, parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-500">
                    {(filters.volumeRange[1] / 1000000).toFixed(1)}M
                  </span>
                </div>
              </div>

              {/* Performance Filter */}
              <div className="space-y-2">
                <label className="text-xs text-gray-500">Performance Range</label>
                <div className="flex space-x-2">
                  <input
                    type="range"
                    min="-0.1"
                    max="0.1"
                    step="0.01"
                    value={filters.performanceRange[1]}
                    onChange={(e) => handleFilterChange('performanceRange', [-0.1, parseFloat(e.target.value)])}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-500">
                    {(filters.performanceRange[1] * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Market Stats */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700">Market Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Avg Volatility</span>
                  <span className="font-medium">0.45</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Avg Volume</span>
                  <span className="font-medium">2.3M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Avg Return</span>
                  <span className="font-medium text-green-600">+2.1%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Active Alerts</span>
                  <span className="font-medium text-blue-600">3</span>
                </div>
              </div>
            </div>

            {/* Keyboard Shortcuts */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700">Keyboard Shortcuts</h3>
              <div className="space-y-1 text-xs text-gray-500">
                <div>← → Navigate days</div>
                <div>↑ ↓ Navigate weeks</div>
                <div>Enter Toggle range selection</div>
                <div>Escape Cancel selection</div>
                <div>Ctrl+E Export data</div>
                <div>Ctrl+A Open alerts</div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              Market Seasonality Explorer v1.0
            </div>
            <div className="text-xs text-gray-400 text-center mt-1">
              Enhanced with AI-powered insights
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 