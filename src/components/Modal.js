import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { X, Settings, Filter, Eye } from 'lucide-react';
import { closeModal } from '../store/slices/uiSlice';
import { setAlerts } from '../store/slices/uiSlice';
import ExportModal from './ExportModal';
import AlertSystem from './AlertSystem';
import PerformanceAnalysis from './PerformanceAnalysis';
import VolumeAnalysis from './VolumeAnalysis';
import VolatilityAnalysis from './VolatilityAnalysis';
import PatternRecognition from './PatternRecognition';

const Modal = ({ type }) => {
  const dispatch = useDispatch();
  const { alerts } = useSelector(state => state.ui);

  const handleClose = () => {
    dispatch(closeModal());
  };

  const handleSaveSettings = () => {
    // Save settings logic would go here
    console.log('Saving settings...');
    dispatch(closeModal());
  };

  // Use specific modal components for complex modals
  if (type === 'export') {
    return <ExportModal />;
  }

  if (type === 'alerts') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Alert System</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-6">
            <AlertSystem />
          </div>
        </div>
      </div>
    );
  }

  // Analysis tool modals
  if (type === 'performance-analysis') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Performance Analysis</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-6">
            <PerformanceAnalysis />
          </div>
        </div>
      </div>
    );
  }

  if (type === 'volume-analysis') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Volume Analysis</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-6">
            <VolumeAnalysis />
          </div>
        </div>
      </div>
    );
  }

  if (type === 'volatility-analysis') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Volatility Analysis</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-6">
            <VolatilityAnalysis />
          </div>
        </div>
      </div>
    );
  }

  if (type === 'pattern-recognition') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Pattern Recognition</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-6">
            <PatternRecognition />
          </div>
        </div>
      </div>
    );
  }

  const renderModalContent = () => {
    switch (type) {
      case 'settings':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Settings
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Volatility Alert Threshold
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={alerts.volatilityThreshold}
                  onChange={(e) => dispatch(setAlerts({ volatilityThreshold: parseFloat(e.target.value) }))}
                  className="w-full"
                />
                <span className="text-sm text-gray-500">
                  {(alerts.volatilityThreshold * 100).toFixed(0)}%
                </span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Volume Alert Threshold
                </label>
                <input
                  type="range"
                  min="0"
                  max="1000000"
                  step="100000"
                  value={alerts.volumeThreshold}
                  onChange={(e) => dispatch(setAlerts({ volumeThreshold: parseInt(e.target.value) }))}
                  className="w-full"
                />
                <span className="text-sm text-gray-500">
                  {(alerts.volumeThreshold / 1000000).toFixed(1)}M
                </span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Performance Alert Threshold
                </label>
                <input
                  type="range"
                  min="0"
                  max="0.1"
                  step="0.01"
                  value={alerts.performanceThreshold}
                  onChange={(e) => dispatch(setAlerts({ performanceThreshold: parseFloat(e.target.value) }))}
                  className="w-full"
                />
                <span className="text-sm text-gray-500">
                  {(alerts.performanceThreshold * 100).toFixed(1)}%
                </span>
              </div>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={alerts.enabled}
                  onChange={(e) => dispatch(setAlerts({ enabled: e.target.checked }))}
                  className="mr-2"
                />
                Enable Alerts
              </label>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleSaveSettings}
                  className="btn-primary flex-1"
                >
                  Save Settings
                </button>
                <button
                  onClick={handleClose}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        );

      case 'filters':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Advanced Filters
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    className="input-field"
                    placeholder="Start Date"
                  />
                  <input
                    type="date"
                    className="input-field"
                    placeholder="End Date"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    className="input-field"
                    placeholder="Min Price"
                  />
                  <input
                    type="number"
                    className="input-field"
                    placeholder="Max Price"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Volatility Range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    className="input-field"
                    placeholder="Min Volatility"
                  />
                  <input
                    type="number"
                    className="input-field"
                    placeholder="Max Volatility"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleClose}
                  className="btn-primary flex-1"
                >
                  Apply Filters
                </button>
                <button
                  onClick={handleClose}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        );

      case 'theme':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              Theme Settings
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 border-2 border-blue-500 bg-blue-50 rounded-lg">
                  <div className="text-center">
                    <div className="font-medium text-blue-900">Default</div>
                    <div className="text-sm text-blue-700">Standard theme</div>
                  </div>
                </button>
                <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300">
                  <div className="text-center">
                    <div className="font-medium text-gray-900">High Contrast</div>
                    <div className="text-sm text-gray-700">Enhanced visibility</div>
                  </div>
                </button>
                <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300">
                  <div className="text-center">
                    <div className="font-medium text-gray-900">Colorblind Friendly</div>
                    <div className="text-sm text-gray-700">Accessible colors</div>
                  </div>
                </button>
                <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300">
                  <div className="text-center">
                    <div className="font-medium text-gray-900">Dark Mode</div>
                    <div className="text-sm text-gray-700">Low light environment</div>
                  </div>
                </button>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleClose}
                  className="btn-primary flex-1"
                >
                  Apply Theme
                </button>
                <button
                  onClick={handleClose}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Modal</h3>
            <p className="text-gray-600">Modal content goes here.</p>
            <button
              onClick={handleClose}
              className="btn-primary"
            >
              Close
            </button>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-0 sm:mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1"></div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {renderModalContent()}
        </div>
      </div>
    </div>
  );
};

export default Modal; 