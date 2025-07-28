import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Palette, Check, ChevronDown } from 'lucide-react';
import { setTheme } from '../store/slices/uiSlice';

const themes = [
  {
    id: 'default',
    name: 'Default',
    color: 'bg-blue-500',
  },
  {
    id: 'high-contrast',
    name: 'High Contrast',
    color: 'bg-yellow-500',
  },
  {
    id: 'colorblind-friendly',
    name: 'Colorblind Friendly',
    color: 'bg-green-500',
  },
  {
    id: 'dark',
    name: 'Dark',
    color: 'bg-gray-800',
  },
];

const ThemeSwitcher = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector(state => state.ui);
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const currentTheme = themes.find(t => t.id === theme) || themes[0];

  return (
    <div className="relative inline-block text-left">
      <button
        ref={buttonRef}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between w-full space-x-2 px-4 py-2 rounded-lg border border-gray-300 bg-white shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select theme"
        type="button"
      >
        <span className="flex items-center space-x-2">
          <Palette className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-800 text-sm">Theme</span>
          <span className={`w-3 h-3 rounded-full border border-gray-200 ${currentTheme.color}`}></span>
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div
          ref={dropdownRef}
          className="absolute left-0 mt-2 min-w-[220px] w-max rounded-lg border border-gray-200 shadow-xl bg-white ring-1 ring-black ring-opacity-5 z-50"
        >
          <div className="py-2">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  dispatch(setTheme(t.id));
                  setOpen(false);
                }}
                className={`w-full flex items-center px-4 py-2 space-x-3 text-left text-sm transition-colors focus:outline-none hover:bg-gray-100 ${
                  theme === t.id ? 'font-semibold bg-blue-50' : ''
                }`}
                role="option"
                aria-selected={theme === t.id}
                tabIndex={0}
              >
                <span className={`w-3 h-3 rounded-full border border-gray-200 ${t.color}`}></span>
                <span className="flex-1 whitespace-normal break-words">{t.name}</span>
                {theme === t.id && <Check className="w-4 h-4 text-blue-600" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher; 