import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ChevronLeft, ChevronRight, Settings, Download, Bell, Sun, Moon, Menu, Calendar, BarChart3, TrendingUp } from 'lucide-react';
import { navigateMonth, navigateYear, navigateWeek, setViewMode } from '../store/slices/calendarSlice';
import { setTheme, toggleSidebar, openModal } from '../store/slices/uiSlice';
import ThemeSwitcher from './ThemeSwitcher';

const Header = () => {
  const dispatch = useDispatch();
  const { currentDate, viewMode } = useSelector(state => state.calendar);
  const { selectedSymbol } = useSelector(state => state.marketData);
  const { theme } = useSelector(state => state.ui);

  const handleNavigate = (direction) => {
    if (viewMode === 'daily') {
      dispatch(navigateMonth({ direction }));
    } else if (viewMode === 'weekly') {
      dispatch(navigateWeek({ direction }));
    } else {
      dispatch(navigateYear({ direction }));
    }
  };

  const handleViewModeChange = (mode) => {
    dispatch(setViewMode(mode));
  };

  const handleThemeToggle = () => {
    dispatch(setTheme(theme === 'light' ? 'dark' : 'light'));
  };

  const handleExport = () => {
    dispatch(openModal('export'));
  };

  const handleSettings = () => {
    dispatch(openModal('settings'));
  };

  const getViewModeIcon = (mode) => {
    switch (mode) {
      case 'daily':
        return <Calendar className="w-4 h-4" />;
      case 'weekly':
        return <BarChart3 className="w-4 h-4" />;
      case 'monthly':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getNavigationLabel = () => {
    switch (viewMode) {
      case 'daily':
        return currentDate.toLocaleDateString('en-US', { 
          month: 'long', 
          year: 'numeric' 
        });
      case 'weekly':
        return `Week of ${currentDate.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          year: 'numeric' 
        })}`;
      case 'monthly':
        return currentDate.toLocaleDateString('en-US', { 
          year: 'numeric' 
        });
      default:
        return currentDate.toLocaleDateString('en-US', { 
          month: 'long', 
          year: 'numeric' 
        });
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
        {/* Left Section */}
        <div className="flex flex-col xs:flex-row items-start xs:items-center space-y-2 xs:space-y-0 xs:space-x-4 w-full overflow-x-auto">
          {/* Mobile Menu Button */}
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Navigation Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleNavigate('prev')}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Previous period"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
              {getNavigationLabel()}
            </h1>
            <button
              onClick={() => handleNavigate('next')}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Next period"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1 mt-2 xs:mt-0">
            {[
              { id: 'daily', name: 'Daily' },
              { id: 'weekly', name: 'Weekly' },
              { id: 'monthly', name: 'Monthly' }
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => handleViewModeChange(mode.id)}
                className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center space-x-1 ${
                  viewMode === mode.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {getViewModeIcon(mode.id)}
                <span>{mode.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2 sm:space-x-4 mt-2 sm:mt-0 w-full sm:w-auto overflow-x-auto">
          {/* Symbol Display */}
          <div className="hidden md:flex items-center space-x-2">
            <span className="text-xs sm:text-sm text-gray-500">Symbol:</span>
            <span className="font-medium text-gray-900">{selectedSymbol}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Theme Switcher */}
            <ThemeSwitcher />
            <button
              onClick={handleExport}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Export data"
              title="Export Data"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={handleSettings}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Settings"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={handleThemeToggle}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle theme"
              title="Toggle Theme"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>
            <button
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
              aria-label="Notifications"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 