import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Bell, AlertTriangle, CheckCircle, Settings, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { showNotification } from '../store/slices/uiSlice';

const AlertSystem = () => {
  const dispatch = useDispatch();
  const { marketData, selectedSymbol } = useSelector(state => state.marketData);
  const { selectedDate } = useSelector(state => state.calendar);
  
  const [alerts, setAlerts] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAlert, setNewAlert] = useState({
    name: '',
    type: 'volatility',
    condition: 'above',
    value: '',
    enabled: true
  });

  const symbolData = marketData[selectedSymbol]?.data || [];
  const currentData = symbolData.find(day => 
    selectedDate && day.date === format(selectedDate, 'yyyy-MM-dd')
  );

  // Check alerts against current data
  useEffect(() => {
    if (!currentData) return;

    alerts.forEach(alert => {
      if (!alert.enabled) return;

      let shouldTrigger = false;
      let currentValue = 0;

      switch (alert.type) {
        case 'volatility':
          currentValue = currentData.volatility * 100;
          break;
        case 'performance':
          currentValue = currentData.performance * 100;
          break;
        case 'volume':
          currentValue = currentData.volume / 1000000; // Convert to millions
          break;
        case 'price':
          currentValue = currentData.close;
          break;
        default:
          return;
      }

      switch (alert.condition) {
        case 'above':
          shouldTrigger = currentValue > parseFloat(alert.value);
          break;
        case 'below':
          shouldTrigger = currentValue < parseFloat(alert.value);
          break;
        case 'equals':
          shouldTrigger = Math.abs(currentValue - parseFloat(alert.value)) < 0.1;
          break;
        default:
          return;
      }

      if (shouldTrigger) {
        dispatch(showNotification({
          type: 'alert',
          title: `Alert: ${alert.name}`,
          message: `${alert.type} is ${currentValue.toFixed(2)} (${alert.condition} ${alert.value})`,
          duration: 5000
        }));
      }
    });
  }, [currentData, alerts, dispatch]);

  const alertTypes = [
    { id: 'volatility', name: 'Volatility', unit: '%', description: 'Price volatility percentage' },
    { id: 'performance', name: 'Performance', unit: '%', description: 'Daily price change percentage' },
    { id: 'volume', name: 'Volume', unit: 'M', description: 'Trading volume in millions' },
    { id: 'price', name: 'Price', unit: '$', description: 'Current price level' }
  ];

  const conditions = [
    { id: 'above', name: 'Above', symbol: '>' },
    { id: 'below', name: 'Below', symbol: '<' },
    { id: 'equals', name: 'Equals', symbol: '=' }
  ];

  const handleCreateAlert = () => {
    if (!newAlert.name || !newAlert.value) return;

    const alert = {
      id: Date.now(),
      ...newAlert,
      value: parseFloat(newAlert.value),
      createdAt: new Date(),
      triggered: false
    };

    setAlerts([...alerts, alert]);
    setNewAlert({
      name: '',
      type: 'volatility',
      condition: 'above',
      value: '',
      enabled: true
    });
    setShowCreateForm(false);
  };

  const handleToggleAlert = (alertId) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId 
        ? { ...alert, enabled: !alert.enabled }
        : alert
    ));
  };

  const handleDeleteAlert = (alertId) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'volatility':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'performance':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'volume':
        return <Bell className="w-4 h-4 text-blue-600" />;
      case 'price':
        return <Settings className="w-4 h-4 text-purple-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const getCurrentValue = (type) => {
    if (!currentData) return 'N/A';

    switch (type) {
      case 'volatility':
        return `${(currentData.volatility * 100).toFixed(1)}%`;
      case 'performance':
        return `${(currentData.performance * 100).toFixed(2)}%`;
      case 'volume':
        return `${(currentData.volume / 1000000).toFixed(1)}M`;
      case 'price':
        return `$${currentData.close.toFixed(2)}`;
      default:
        return 'N/A';
    }
  };

  return (
    <div className="card p-2 sm:p-4 md:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2 sm:gap-0">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Alert System</h3>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center space-x-2 px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Alert</span>
        </button>
      </div>

      {/* Create Alert Form */}
      {showCreateForm && (
        <div className="mb-4 sm:mb-6 p-2 sm:p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm sm:text-md font-medium text-gray-900 mb-2 sm:mb-4">Create New Alert</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alert Name
              </label>
              <input
                type="text"
                value={newAlert.name}
                onChange={(e) => setNewAlert({ ...newAlert, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., High Volatility Alert"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alert Type
              </label>
              <select
                value={newAlert.type}
                onChange={(e) => setNewAlert({ ...newAlert, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {alertTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Condition
              </label>
              <select
                value={newAlert.condition}
                onChange={(e) => setNewAlert({ ...newAlert, condition: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {conditions.map(condition => (
                  <option key={condition.id} value={condition.id}>
                    {condition.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Threshold Value
              </label>
              <input
                type="number"
                step="0.01"
                value={newAlert.value}
                onChange={(e) => setNewAlert({ ...newAlert, value: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter value"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 sm:space-x-3 mt-2 sm:mt-4">
            <button
              onClick={() => setShowCreateForm(false)}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateAlert}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Alert
            </button>
          </div>
        </div>
      )}

      {/* Current Values */}
      {currentData && (
        <div className="mb-4 sm:mb-6 p-2 sm:p-4 bg-blue-50 rounded-lg">
          <h4 className="text-xs sm:text-sm font-medium text-blue-900 mb-1 sm:mb-3">Current Values</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm">
            {alertTypes.map(type => (
              <div key={type.id} className="flex items-center space-x-2">
                {getAlertIcon(type.id)}
                <div>
                  <div className="font-medium text-blue-900">{type.name}</div>
                  <div className="text-blue-700">{getCurrentValue(type.id)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alerts List */}
      <div className="space-y-2 sm:space-y-3">
        <h4 className="text-sm sm:text-md font-medium text-gray-900">Active Alerts</h4>
        
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No alerts configured</p>
            <p className="text-sm">Create your first alert to get started</p>
          </div>
        ) : (
          alerts.map(alert => {
            const alertType = alertTypes.find(type => type.id === alert.type);
            const condition = conditions.find(c => c.id === alert.condition);
            
            return (
              <div
                key={alert.id}
                className={`p-2 sm:p-4 border rounded-lg transition-all ${
                  alert.enabled
                    ? 'border-gray-200 bg-white'
                    : 'border-gray-200 bg-gray-50 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getAlertIcon(alert.type)}
                    <div>
                      <div className="font-medium text-gray-900">{alert.name}</div>
                      <div className="text-sm text-gray-500">
                        {alertType?.name} {condition?.symbol} {alert.value}{alertType?.unit}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleAlert(alert.id)}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                        alert.enabled
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {alert.enabled ? 'Active' : 'Inactive'}
                    </button>
                    <button
                      onClick={() => handleDeleteAlert(alert.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="mt-1 sm:mt-2 text-xs text-gray-500">
                  Created {format(new Date(alert.createdAt), 'MMM dd, yyyy')}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Alert Statistics */}
      {alerts.length > 0 && (
        <div className="mt-4 sm:mt-6 p-2 sm:p-4 bg-gray-50 rounded-lg">
          <h4 className="text-xs sm:text-sm font-medium text-gray-900 mb-1 sm:mb-3">Alert Statistics</h4>
          <div className="grid grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
            <div>
              <div className="font-medium text-gray-900">{alerts.length}</div>
              <div className="text-gray-500">Total Alerts</div>
            </div>
            <div>
              <div className="font-medium text-gray-900">
                {alerts.filter(alert => alert.enabled).length}
              </div>
              <div className="text-gray-500">Active Alerts</div>
            </div>
            <div>
              <div className="font-medium text-gray-900">
                {alerts.filter(alert => alert.triggered).length}
              </div>
              <div className="text-gray-500">Triggered Today</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertSystem; 