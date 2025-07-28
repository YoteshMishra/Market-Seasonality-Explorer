import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { format, isSameDay, startOfWeek, startOfMonth } from 'date-fns';
import { setSelectedDate, setSelectedRange, setViewMode } from '../store/slices/calendarSlice';
import { showTooltip, hideTooltip } from '../store/slices/uiSlice';
import { ZoomIn, ZoomOut, Calendar as CalendarIcon, BarChart3, TrendingUp } from 'lucide-react';
import CalendarCell from './CalendarCell';
import CalendarHeader from './CalendarHeader';

const Calendar = () => {
  const dispatch = useDispatch();
  const { calendarDays, selectedDate, selectedRange, viewMode } = useSelector(state => state.calendar);
  const { marketData, selectedSymbol } = useSelector(state => state.marketData);
  
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isSelectingRange, setIsSelectingRange] = useState(false);
  const [rangeStart, setRangeStart] = useState(null);

  // Get market data for the selected symbol
  const symbolData = useMemo(() => marketData[selectedSymbol]?.data || [], [marketData, selectedSymbol]);

  // Create a map of date to market data for quick lookup
  const marketDataMap = useMemo(() => {
    const map = new Map();
    symbolData.forEach(day => {
      map.set(day.date, day);
    });
    return map;
  }, [symbolData]);

  // Aggregate data based on view mode
  const aggregatedData = useMemo(() => {
    if (viewMode === 'daily') {
      return marketDataMap;
    }

    const aggregated = new Map();
    
    if (viewMode === 'weekly') {
      // Group by weeks
      const weeklyData = {};
      symbolData.forEach(day => {
        const weekStart = format(startOfWeek(new Date(day.date)), 'yyyy-MM-dd');
        if (!weeklyData[weekStart]) {
          weeklyData[weekStart] = [];
        }
        weeklyData[weekStart].push(day);
      });

      Object.entries(weeklyData).forEach(([weekStart, days]) => {
        const avgOpen = days.reduce((sum, day) => sum + day.open, 0) / days.length;
        const maxHigh = Math.max(...days.map(day => day.high));
        const minLow = Math.min(...days.map(day => day.low));
        const lastClose = days[days.length - 1].close;
        const totalVolume = days.reduce((sum, day) => sum + day.volume, 0);
        const avgVolatility = days.reduce((sum, day) => sum + day.volatility, 0) / days.length;
        const totalPerformance = days.reduce((sum, day) => sum + day.performance, 0);

        aggregated.set(weekStart, {
          date: weekStart,
          open: avgOpen,
          high: maxHigh,
          low: minLow,
          close: lastClose,
          volume: totalVolume,
          volatility: avgVolatility,
          performance: totalPerformance,
          type: 'weekly'
        });
      });
    } else if (viewMode === 'monthly') {
      // Group by months
      const monthlyData = {};
      symbolData.forEach(day => {
        const monthStart = format(startOfMonth(new Date(day.date)), 'yyyy-MM-dd');
        if (!monthlyData[monthStart]) {
          monthlyData[monthStart] = [];
        }
        monthlyData[monthStart].push(day);
      });

      Object.entries(monthlyData).forEach(([monthStart, days]) => {
        const avgOpen = days.reduce((sum, day) => sum + day.open, 0) / days.length;
        const maxHigh = Math.max(...days.map(day => day.high));
        const minLow = Math.min(...days.map(day => day.low));
        const lastClose = days[days.length - 1].close;
        const totalVolume = days.reduce((sum, day) => sum + day.volume, 0);
        const avgVolatility = days.reduce((sum, day) => sum + day.volatility, 0) / days.length;
        const totalPerformance = days.reduce((sum, day) => sum + day.performance, 0);

        aggregated.set(monthStart, {
          date: monthStart,
          open: avgOpen,
          high: maxHigh,
          low: minLow,
          close: lastClose,
          volume: totalVolume,
          volatility: avgVolatility,
          performance: totalPerformance,
          type: 'monthly'
        });
      });
    }

    return aggregated;
  }, [symbolData, viewMode, marketDataMap]);

  const handleCellClick = useCallback((date) => {
    if (isSelectingRange) {
      if (!rangeStart) {
        setRangeStart(date);
      } else {
        const start = rangeStart < date ? rangeStart : date;
        const end = rangeStart < date ? date : rangeStart;
        dispatch(setSelectedRange({ start, end }));
        setIsSelectingRange(false);
        setRangeStart(null);
      }
    } else {
      dispatch(setSelectedDate(date));
    }
  }, [dispatch, isSelectingRange, rangeStart]);

  const handleCellHover = useCallback((event, date, marketData) => {
    if (!marketData) return;

    const tooltipContent = `
      <div class="space-y-2">
        <div class="font-semibold">${format(date, 'MMM dd, yyyy')}</div>
        <div class="text-sm space-y-1">
          <div>Open: $${marketData.open.toFixed(2)}</div>
          <div>High: $${marketData.high.toFixed(2)}</div>
          <div>Low: $${marketData.low.toFixed(2)}</div>
          <div>Close: $${marketData.close.toFixed(2)}</div>
          <div>Volume: ${(marketData.volume / 1000000).toFixed(2)}M</div>
          <div>Volatility: ${(marketData.volatility * 100).toFixed(1)}%</div>
          <div class="${marketData.performance >= 0 ? 'text-green-600' : 'text-red-600'}">
            Performance: ${(marketData.performance * 100).toFixed(2)}%
          </div>
          ${marketData.type ? `<div class="text-xs text-gray-500">${marketData.type} view</div>` : ''}
        </div>
      </div>
    `;

    dispatch(showTooltip({
      content: tooltipContent,
      position: { x: event.clientX, y: event.clientY }
    }));
  }, [dispatch]);

  const handleCellMouseLeave = useCallback(() => {
    dispatch(hideTooltip());
  }, [dispatch]);

  const getVolatilityClass = useCallback((volatility) => {
    if (volatility < 0.3) return 'volatility-low';
    if (volatility < 0.7) return 'volatility-medium';
    return 'volatility-high';
  }, []);

  const getPerformanceClass = useCallback((performance) => {
    if (performance > 0.02) return 'performance-positive';
    if (performance < -0.02) return 'performance-negative';
    return 'performance-neutral';
  }, []);

  const getVolumeIndicator = useCallback((volume) => {
    const normalizedVolume = Math.min(volume / 1000000, 1); // Normalize to 0-1
    return Math.ceil(normalizedVolume * 5); // 1-5 bars
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedDate) return;

      let newDate = new Date(selectedDate);
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          newDate.setDate(newDate.getDate() - 1);
          dispatch(setSelectedDate(newDate));
          break;
        case 'ArrowRight':
          e.preventDefault();
          newDate.setDate(newDate.getDate() + 1);
          dispatch(setSelectedDate(newDate));
          break;
        case 'ArrowUp':
          e.preventDefault();
          newDate.setDate(newDate.getDate() - 7);
          dispatch(setSelectedDate(newDate));
          break;
        case 'ArrowDown':
          e.preventDefault();
          newDate.setDate(newDate.getDate() + 7);
          dispatch(setSelectedDate(newDate));
          break;
        case 'Escape':
          setIsSelectingRange(false);
          setRangeStart(null);
          break;
        case 'Enter':
          e.preventDefault();
          setIsSelectingRange(!isSelectingRange);
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedDate, dispatch, isSelectingRange]);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleViewModeChange = (mode) => {
    dispatch(setViewMode(mode));
  };

  return (
    <div className="card p-2 sm:p-4 md:p-6">
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-2">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Market Calendar</h2>
          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => handleViewModeChange('daily')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  viewMode === 'daily' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <CalendarIcon className="w-4 h-4 inline mr-1" />
                Daily
              </button>
              <button
                onClick={() => handleViewModeChange('weekly')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  viewMode === 'weekly' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <BarChart3 className="w-4 h-4 inline mr-1" />
                Weekly
              </button>
              <button
                onClick={() => handleViewModeChange('monthly')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  viewMode === 'monthly' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <TrendingUp className="w-4 h-4 inline mr-1" />
                Monthly
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={handleZoomOut}
                className="px-2 py-1 text-gray-600 hover:text-gray-900 transition-colors"
                disabled={zoomLevel <= 0.5}
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="px-2 py-1 text-xs text-gray-600">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                className="px-2 py-1 text-gray-600 hover:text-gray-900 transition-colors"
                disabled={zoomLevel >= 2}
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            {/* Range Selection Toggle */}
            <button
              onClick={() => setIsSelectingRange(!isSelectingRange)}
              className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium transition-colors ${
                isSelectingRange 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {isSelectingRange ? 'Cancel Range' : 'Select Range'}
            </button>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-gray-600">
          Interactive calendar showing {viewMode} volatility, liquidity, and performance data for {selectedSymbol}
          {isSelectingRange && <span className="text-blue-600 font-medium"> - Click to select range start</span>}
        </p>
      </div>

      {/* Calendar Header */}
      <CalendarHeader />

      {/* Calendar Grid */}
      <div 
        className="grid grid-cols-7 gap-0.5 sm:gap-1 transition-transform duration-200"
        style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}
      >
        {/* Day Headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="p-3 text-center text-sm font-medium text-gray-500 bg-gray-50 rounded-lg"
          >
            {day}
          </div>
        ))}

        {/* Calendar Cells */}
        {calendarDays.map((day, index) => {
          const marketData = viewMode === 'daily' 
            ? marketDataMap.get(format(day.date, 'yyyy-MM-dd'))
            : aggregatedData.get(format(day.date, 'yyyy-MM-dd'));
          
          const isSelected = selectedDate && isSameDay(day.date, selectedDate);
          const isInRange = selectedRange.start && selectedRange.end && 
            day.date >= selectedRange.start && day.date <= selectedRange.end;
          const isRangeStart = rangeStart && isSameDay(day.date, rangeStart);

          return (
            <CalendarCell
              key={index}
              day={day}
              marketData={marketData}
              isSelected={isSelected}
              isInRange={isInRange}
              isRangeStart={isRangeStart}
              viewMode={viewMode}
              onClick={() => handleCellClick(day.date)}
              onMouseEnter={(e) => handleCellHover(e, day.date, marketData)}
              onMouseLeave={handleCellMouseLeave}
              getVolatilityClass={getVolatilityClass}
              getPerformanceClass={getPerformanceClass}
              getVolumeIndicator={getVolumeIndicator}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 sm:mt-6 p-2 sm:p-4 bg-gray-50 rounded-lg">
        <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 text-xs">
          <div className="space-y-2">
            <div className="font-medium text-gray-600">Volatility</div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
              <span>Low</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-100 border border-yellow-200 rounded"></div>
              <span>Medium</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
              <span>High</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-medium text-gray-600">Performance</div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 text-green-600">↗</div>
              <span>Positive</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 text-red-600">↘</div>
              <span>Negative</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 text-gray-600">→</div>
              <span>Neutral</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-medium text-gray-600">Volume</div>
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-1 h-4 bg-blue-500 rounded"></div>
                ))}
              </div>
              <span>High</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-1 h-4 bg-blue-300 rounded"></div>
                ))}
              </div>
              <span>Medium</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {[1].map((i) => (
                  <div key={i} className="w-1 h-4 bg-blue-200 rounded"></div>
                ))}
              </div>
              <span>Low</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-medium text-gray-600">Navigation</div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span>Today</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-200 rounded"></div>
              <span>Selected</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-100 rounded"></div>
              <span>Range</span>
            </div>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Help */}
      <div className="mt-2 sm:mt-4 p-2 sm:p-3 bg-blue-50 rounded-lg">
        <h4 className="text-xs sm:text-sm font-medium text-blue-700 mb-1 sm:mb-2">Keyboard Shortcuts</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1 sm:gap-2 text-xs text-blue-600">
          <div>← → : Navigate days</div>
          <div>↑ ↓ : Navigate weeks</div>
          <div>Enter : Toggle range selection</div>
          <div>Escape : Cancel selection</div>
        </div>
      </div>
    </div>
  );
};

export default Calendar; 