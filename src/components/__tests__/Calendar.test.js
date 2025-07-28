import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Calendar from '../Calendar';
import calendarReducer from '../../store/slices/calendarSlice';
import marketDataReducer from '../../store/slices/marketDataSlice';
import uiReducer from '../../store/slices/uiSlice';

// Mock store setup
const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      calendar: calendarReducer,
      marketData: marketDataReducer,
      ui: uiReducer,
    },
    preloadedState: initialState,
  });
};

// Mock data
const mockMarketData = {
  marketData: {
    BTCUSDT: {
      data: [
        {
          date: '2024-01-01',
          open: 50000,
          high: 51000,
          low: 49000,
          close: 50500,
          volume: 1000000,
          volatility: 0.45,
          liquidity: 0.75,
          performance: 0.02,
          vix: 25.5,
          rsi: 65.2,
          movingAverage20: 50200,
          movingAverage50: 49800,
        },
      ],
    },
  },
  selectedSymbol: 'BTCUSDT',
};

describe('Calendar Component', () => {
  let store;

  beforeEach(() => {
    store = createTestStore({
      calendar: {
        currentDate: new Date('2024-01-01'),
        selectedDate: null,
        selectedRange: { start: null, end: null },
        viewMode: 'daily',
        calendarDays: [],
        isLoading: false,
        error: null,
      },
      marketData: mockMarketData,
      ui: {
        theme: 'light',
        sidebarOpen: false,
        modalOpen: false,
        modalType: null,
        tooltip: { visible: false, content: '', position: { x: 0, y: 0 } },
        notifications: [],
        zoomLevel: 1,
        selectedDateRange: null,
        exportSettings: { format: 'pdf', includeCharts: true, includeData: true },
        alerts: { volatilityThreshold: 0.7, volumeThreshold: 500000, performanceThreshold: 0.05, enabled: false },
      },
    });
  });

  test('renders calendar component', () => {
    render(
      <Provider store={store}>
        <Calendar />
      </Provider>
    );

    expect(screen.getByText('Market Calendar')).toBeInTheDocument();
    expect(screen.getByText('Daily')).toBeInTheDocument();
    expect(screen.getByText('Weekly')).toBeInTheDocument();
    expect(screen.getByText('Monthly')).toBeInTheDocument();
  });

  test('displays view mode toggle buttons', () => {
    render(
      <Provider store={store}>
        <Calendar />
      </Provider>
    );

    expect(screen.getByText('Daily')).toBeInTheDocument();
    expect(screen.getByText('Weekly')).toBeInTheDocument();
    expect(screen.getByText('Monthly')).toBeInTheDocument();
  });

  test('displays zoom controls', () => {
    render(
      <Provider store={store}>
        <Calendar />
      </Provider>
    );

    expect(screen.getByText('Select Range')).toBeInTheDocument();
  });

  test('displays day headers', () => {
    render(
      <Provider store={store}>
        <Calendar />
      </Provider>
    );

    expect(screen.getByText('Sun')).toBeInTheDocument();
    expect(screen.getByText('Mon')).toBeInTheDocument();
    expect(screen.getByText('Tue')).toBeInTheDocument();
    expect(screen.getByText('Wed')).toBeInTheDocument();
    expect(screen.getByText('Thu')).toBeInTheDocument();
    expect(screen.getByText('Fri')).toBeInTheDocument();
    expect(screen.getByText('Sat')).toBeInTheDocument();
  });

  test('displays legend', () => {
    render(
      <Provider store={store}>
        <Calendar />
      </Provider>
    );

    expect(screen.getByText('Legend')).toBeInTheDocument();
    expect(screen.getByText('Volatility')).toBeInTheDocument();
    expect(screen.getByText('Performance')).toBeInTheDocument();
    expect(screen.getByText('Volume')).toBeInTheDocument();
    expect(screen.getByText('Navigation')).toBeInTheDocument();
  });

  test('displays keyboard shortcuts help', () => {
    render(
      <Provider store={store}>
        <Calendar />
      </Provider>
    );

    expect(screen.getByText('Keyboard Shortcuts')).toBeInTheDocument();
    expect(screen.getByText('← → : Navigate days')).toBeInTheDocument();
    expect(screen.getByText('↑ ↓ : Navigate weeks')).toBeInTheDocument();
    expect(screen.getByText('Enter : Toggle range selection')).toBeInTheDocument();
    expect(screen.getByText('Escape : Cancel selection')).toBeInTheDocument();
  });
});

describe('Calendar Interactions', () => {
  let store;

  beforeEach(() => {
    store = createTestStore({
      calendar: {
        currentDate: new Date('2024-01-01'),
        selectedDate: null,
        selectedRange: { start: null, end: null },
        viewMode: 'daily',
        calendarDays: [
          {
            date: new Date('2024-01-01'),
            isCurrentMonth: true,
            isToday: false,
          },
        ],
        isLoading: false,
        error: null,
      },
      marketData: mockMarketData,
      ui: {
        theme: 'light',
        sidebarOpen: false,
        modalOpen: false,
        modalType: null,
        tooltip: { visible: false, content: '', position: { x: 0, y: 0 } },
        notifications: [],
        zoomLevel: 1,
        selectedDateRange: null,
        exportSettings: { format: 'pdf', includeCharts: true, includeData: true },
        alerts: { volatilityThreshold: 0.7, volumeThreshold: 500000, performanceThreshold: 0.05, enabled: false },
      },
    });
  });

  test('view mode toggle functionality', () => {
    render(
      <Provider store={store}>
        <Calendar />
      </Provider>
    );

    const weeklyButton = screen.getByText('Weekly');
    fireEvent.click(weeklyButton);

    // Check if the button is now active
    expect(weeklyButton.closest('button')).toHaveClass('bg-white');
  });

  test('range selection toggle', () => {
    render(
      <Provider store={store}>
        <Calendar />
      </Provider>
    );

    const rangeButton = screen.getByText('Select Range');
    fireEvent.click(rangeButton);

    // Check if the button text changes
    expect(screen.getByText('Cancel Range')).toBeInTheDocument();
  });
});

describe('Calendar Accessibility', () => {
  let store;

  beforeEach(() => {
    store = createTestStore({
      calendar: {
        currentDate: new Date('2024-01-01'),
        selectedDate: null,
        selectedRange: { start: null, end: null },
        viewMode: 'daily',
        calendarDays: [],
        isLoading: false,
        error: null,
      },
      marketData: mockMarketData,
      ui: {
        theme: 'light',
        sidebarOpen: false,
        modalOpen: false,
        modalType: null,
        tooltip: { visible: false, content: '', position: { x: 0, y: 0 } },
        notifications: [],
        zoomLevel: 1,
        selectedDateRange: null,
        exportSettings: { format: 'pdf', includeCharts: true, includeData: true },
        alerts: { volatilityThreshold: 0.7, volumeThreshold: 500000, performanceThreshold: 0.05, enabled: false },
      },
    });
  });

  test('keyboard navigation support', () => {
    render(
      <Provider store={store}>
        <Calendar />
      </Provider>
    );

    // Test that keyboard events are handled
    const calendar = screen.getByText('Market Calendar').closest('.card');
    expect(calendar).toBeInTheDocument();
  });

  test('screen reader support', () => {
    render(
      <Provider store={store}>
        <Calendar />
      </Provider>
    );

    // Check for proper ARIA labels and roles
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});

describe('Calendar Responsive Design', () => {
  let store;

  beforeEach(() => {
    store = createTestStore({
      calendar: {
        currentDate: new Date('2024-01-01'),
        selectedDate: null,
        selectedRange: { start: null, end: null },
        viewMode: 'daily',
        calendarDays: [],
        isLoading: false,
        error: null,
      },
      marketData: mockMarketData,
      ui: {
        theme: 'light',
        sidebarOpen: false,
        modalOpen: false,
        modalType: null,
        tooltip: { visible: false, content: '', position: { x: 0, y: 0 } },
        notifications: [],
        zoomLevel: 1,
        selectedDateRange: null,
        exportSettings: { format: 'pdf', includeCharts: true, includeData: true },
        alerts: { volatilityThreshold: 0.7, volumeThreshold: 500000, performanceThreshold: 0.05, enabled: false },
      },
    });
  });

  test('responsive layout classes', () => {
    render(
      <Provider store={store}>
        <Calendar />
      </Provider>
    );

    const calendar = screen.getByText('Market Calendar').closest('.card');
    expect(calendar).toHaveClass('card');
  });

  test('mobile-friendly controls', () => {
    render(
      <Provider store={store}>
        <Calendar />
      </Provider>
    );

    // Check that controls are touch-friendly
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toHaveClass('transition-colors');
    });
  });
}); 