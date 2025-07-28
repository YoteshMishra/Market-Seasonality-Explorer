import { configureStore } from '@reduxjs/toolkit';
import calendarReducer from './slices/calendarSlice';
import marketDataReducer from './slices/marketDataSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    calendar: calendarReducer,
    marketData: marketDataReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['marketData/fetchMarketData/fulfilled'],
      },
    }),
}); 