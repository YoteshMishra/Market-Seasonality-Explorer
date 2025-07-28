import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Palette, Eye } from 'lucide-react';
import { setTheme } from '../store/slices/uiSlice';

const ThemeSwitcher = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector(state => state.ui);
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    {
      id: 'default',
      name: 'Default',
      description: 'Standard color scheme',
      colors: {
        primary: 'blue',
        volatility: {
          low: 'green',
          medium: 'yellow',
          high: 'red'
        },
        performance: {
          positive: 'green',
          negative: 'red',
          neutral: 'gray'
        }
      }
    },
    {
      id: 'high-contrast',
      name: 'High Contrast',
      description: 'Enhanced visibility',
      colors: {
        primary: 'purple',
        volatility: {
          low: 'emerald',
          medium: 'amber',
          high: 'rose'
        },
        performance: {
          positive: 'emerald',
          negative: 'rose',
          neutral: 'slate'
        }
      }
    },
    {
      id: 'colorblind-friendly',
      name: 'Colorblind Friendly',
      description: 'Accessible color scheme',
      colors: {
        primary: 'indigo',
        volatility: {
          low: 'teal',
          medium: 'orange',
          high: 'pink'
        },
        performance: {
          positive: 'teal',
          negative: 'pink',
          neutral: 'gray'
        }
      }
    },
    {
      id: 'dark',
      name: 'Dark Mode',
      description: 'Dark theme for low light',
      colors: {
        primary: 'cyan',
        volatility: {
          low: 'emerald',
          medium: 'yellow',
          high: 'red'
        },
        performance: {
          positive: 'emerald',
          negative: 'red',
          neutral: 'gray'
        }
      }
    }
  ];

  const currentTheme = themes.find(t => t.id === theme) || themes[0];

  const handleThemeChange = (themeId) => {
    dispatch(setTheme(themeId));
    setIsOpen(false);
  };

  const getColorPreview = (colorName) => {
    const colorMap = {
      blue: 'bg-blue-500',
      purple: 'bg-purple-500',
      indigo: 'bg-indigo-500',
      cyan: 'bg-cyan-500',
      green: 'bg-green-500',
      emerald: 'bg-emerald-500',
      teal: 'bg-teal-500',
      yellow: 'bg-yellow-500',
      amber: 'bg-amber-500',
      orange: 'bg-orange-500',
      red: 'bg-red-500',
      rose: 'bg-rose-500',
      pink: 'bg-pink-500',
      gray: 'bg-gray-500',
      slate: 'bg-slate-500'
    };
    return colorMap[colorName] || 'bg-gray-500';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <Palette className="w-4 h-4" />
        <span>Theme</span>
        <div className={`w-3 h-3 rounded-full ${getColorPreview(currentTheme.colors.primary)}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Choose Theme</h3>
            
            <div className="space-y-3">
              {themes.map((themeOption) => (
                <button
                  key={themeOption.id}
                  onClick={() => handleThemeChange(themeOption.id)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    theme === themeOption.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-medium text-gray-900">{themeOption.name}</div>
                      <div className="text-sm text-gray-500">{themeOption.description}</div>
                    </div>
                    <div className={`w-4 h-4 rounded-full ${getColorPreview(themeOption.colors.primary)}`} />
                  </div>
                  
                  {/* Color Preview */}
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className={`w-3 h-3 rounded ${getColorPreview(themeOption.colors.volatility.low)}`} />
                      <div className={`w-3 h-3 rounded ${getColorPreview(themeOption.colors.volatility.medium)}`} />
                      <div className={`w-3 h-3 rounded ${getColorPreview(themeOption.colors.volatility.high)}`} />
                    </div>
                    <span className="text-xs text-gray-500">Volatility</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex space-x-1">
                      <div className={`w-3 h-3 rounded ${getColorPreview(themeOption.colors.performance.positive)}`} />
                      <div className={`w-3 h-3 rounded ${getColorPreview(themeOption.colors.performance.negative)}`} />
                      <div className={`w-3 h-3 rounded ${getColorPreview(themeOption.colors.performance.neutral)}`} />
                    </div>
                    <span className="text-xs text-gray-500">Performance</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Accessibility Info */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Eye className="w-4 h-4" />
                <span>Accessibility features available</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher; 