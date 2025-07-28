import React from 'react';
import { format } from 'date-fns';
import { TrendingUp, TrendingDown, Minus, BarChart3, TrendingUp as TrendingUpIcon } from 'lucide-react';

const CalendarCell = ({
  day,
  marketData,
  isSelected,
  isInRange,
  isRangeStart,
  viewMode,
  onClick,
  onMouseEnter,
  onMouseLeave,
  getVolatilityClass,
  getPerformanceClass,
  getVolumeIndicator,
}) => {
  const volatilityClass = marketData ? getVolatilityClass(marketData.volatility) : '';
  const performanceClass = marketData ? getPerformanceClass(marketData.performance) : '';
  const volumeBars = marketData ? getVolumeIndicator(marketData.volume) : 0;

  const getPerformanceIcon = () => {
    if (!marketData) return null;
    
    if (marketData.performance > 0.02) {
      return <TrendingUp className="w-3 h-3 text-green-600" />;
    } else if (marketData.performance < -0.02) {
      return <TrendingDown className="w-3 h-3 text-red-600" />;
    } else {
      return <Minus className="w-3 h-3 text-gray-400" />;
    }
  };

  const getViewModeIcon = () => {
    if (!marketData || !marketData.type) return null;
    
    switch (marketData.type) {
      case 'weekly':
        return <BarChart3 className="w-2 h-2 text-blue-500" />;
      case 'monthly':
        return <TrendingUpIcon className="w-2 h-2 text-purple-500" />;
      default:
        return null;
    }
  };

  const getCellClasses = () => {
    let classes = [
      'calendar-cell',
      'min-h-[80px]',
      'flex',
      'flex-col',
      'justify-between',
      'relative',
      'group'
    ];

    // Add volatility background
    if (volatilityClass) {
      classes.push(volatilityClass);
    }

    // Add selection styles
    if (isSelected) {
      classes.push('ring-2', 'ring-blue-500', 'ring-offset-2');
    } else if (isInRange) {
      classes.push('bg-blue-50', 'border-blue-200');
    }

    // Add range start indicator
    if (isRangeStart) {
      classes.push('ring-2', 'ring-green-500', 'ring-offset-2');
    }

    // Add today indicator
    if (day.isToday) {
      classes.push('ring-2', 'ring-blue-500');
    }

    // Add opacity for non-current month
    if (!day.isCurrentMonth) {
      classes.push('opacity-50');
    }

    return classes.join(' ');
  };

  const getVolumePattern = () => {
    if (!marketData) return null;
    
    const volume = marketData.volume;
    const normalizedVolume = Math.min(volume / 1000000, 1);
    
    if (normalizedVolume > 0.8) {
      return 'bg-gradient-to-r from-blue-500 to-blue-600';
    } else if (normalizedVolume > 0.5) {
      return 'bg-gradient-to-r from-blue-400 to-blue-500';
    } else if (normalizedVolume > 0.2) {
      return 'bg-gradient-to-r from-blue-300 to-blue-400';
    } else {
      return 'bg-gradient-to-r from-blue-200 to-blue-300';
    }
  };

  return (
    <div
      className={getCellClasses()}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Date Number and View Mode Icon */}
      <div className="flex items-center justify-between">
        <span className={`text-sm font-medium ${
          day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
        }`}>
          {format(day.date, 'd')}
        </span>
        
        <div className="flex items-center space-x-1">
          {/* View Mode Icon */}
          {getViewModeIcon()}
          
          {/* Performance Icon */}
          {getPerformanceIcon()}
        </div>
      </div>

      {/* Market Data Indicators */}
      {marketData && (
        <div className="space-y-1">
          {/* Volume Pattern */}
          <div className="h-2 rounded-sm overflow-hidden">
            <div className={`h-full ${getVolumePattern()}`} />
          </div>

          {/* Volume Bars */}
          <div className="flex items-end space-x-0.5 h-3">
            {Array.from({ length: 5 }, (_, i) => (
              <div
                key={i}
                className={`w-1 rounded-sm transition-all duration-200 ${
                  i < volumeBars
                    ? 'bg-blue-500'
                    : 'bg-gray-200'
                }`}
                style={{ height: `${(i + 1) * 2}px` }}
              />
            ))}
          </div>

          {/* Price Change */}
          <div className={`text-xs font-medium ${performanceClass}`}>
            {marketData.performance >= 0 ? '+' : ''}
            {(marketData.performance * 100).toFixed(1)}%
          </div>

          {/* Volatility Indicator */}
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${
              marketData.volatility < 0.3
                ? 'bg-green-500'
                : marketData.volatility < 0.7
                ? 'bg-yellow-500'
                : 'bg-red-500'
            }`} />
            <span className="text-xs text-gray-500">
              {(marketData.volatility * 100).toFixed(0)}%
            </span>
          </div>

          {/* View Mode Label */}
          {marketData.type && marketData.type !== 'daily' && (
            <div className="text-xs text-gray-400 font-medium">
              {marketData.type}
            </div>
          )}
        </div>
      )}

      {/* Today Indicator */}
      {day.isToday && (
        <div className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
      )}

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none" />
      )}

      {/* Range Start Indicator */}
      {isRangeStart && (
        <div className="absolute inset-0 border-2 border-green-500 rounded-lg pointer-events-none" />
      )}

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none rounded-lg" />

      {/* Liquidity Pattern Overlay */}
      {marketData && marketData.liquidity > 0.7 && (
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="w-full h-full bg-gradient-to-br from-transparent via-blue-200 to-transparent" />
        </div>
      )}
    </div>
  );
};

export default CalendarCell; 