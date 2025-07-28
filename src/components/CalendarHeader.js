import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ChevronLeft, ChevronRight, Calendar, Grid, List } from 'lucide-react';
import { navigateMonth, navigateYear, setViewMode } from '../store/slices/calendarSlice';
import { format } from 'date-fns';

const CalendarHeader = () => {
  const dispatch = useDispatch();
  const { currentDate, viewMode } = useSelector(state => state.calendar);

  const handleNavigate = (direction) => {
    if (viewMode === 'month') {
      dispatch(navigateMonth({ direction }));
    } else {
      dispatch(navigateYear({ direction }));
    }
  };

  const handleViewModeChange = (mode) => {
    dispatch(setViewMode(mode));
  };

  const getViewModeIcon = (mode) => {
    switch (mode) {
      case 'day':
        return <Calendar className="w-4 h-4" />;
      case 'week':
        return <Grid className="w-4 h-4" />;
      case 'month':
        return <List className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex items-center justify-between mb-6">
      {/* Navigation Controls */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => handleNavigate('prev')}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Previous period"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold text-gray-900">
          {format(currentDate, 'MMMM yyyy')}
        </h2>

        <button
          onClick={() => handleNavigate('next')}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Next period"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
        {[
          { mode: 'day', label: 'Day' },
          { mode: 'week', label: 'Week' },
          { mode: 'month', label: 'Month' }
        ].map(({ mode, label }) => (
          <button
            key={mode}
            onClick={() => handleViewModeChange(mode)}
            className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              viewMode === mode
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {getViewModeIcon(mode)}
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CalendarHeader; 