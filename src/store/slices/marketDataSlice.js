import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock data generator for demo purposes
const generateMockMarketData = (date) => {
  const basePrice = 50000 + Math.random() * 10000;
  const volatility = Math.random();
  const volume = Math.random() * 1000000;
  const priceChange = (Math.random() - 0.5) * 0.1; // ±5% change
  
  return {
    date: date.toISOString().split('T')[0],
    open: basePrice,
    high: basePrice * (1 + Math.random() * 0.05),
    low: basePrice * (1 - Math.random() * 0.05),
    close: basePrice * (1 + priceChange),
    volume: volume,
    volatility: volatility,
    liquidity: Math.random(),
    performance: priceChange,
    vix: volatility * 30 + 10,
    rsi: 30 + Math.random() * 40,
    movingAverage20: basePrice * (1 + (Math.random() - 0.5) * 0.02),
    movingAverage50: basePrice * (1 + (Math.random() - 0.5) * 0.03),
  };
};

// Async thunk for fetching market data
export const fetchMarketData = createAsyncThunk(
  'marketData/fetchMarketData',
  async ({ symbol = 'BTCUSDT', startDate, endDate }, { rejectWithValue }) => {
    try {
      // For demo purposes, we'll use mock data
      // In a real application, you would call actual APIs like:
      // const response = await axios.get(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1d&startTime=${startDate}&endTime=${endDate}`);
      
      const days = [];
      const currentDate = new Date(startDate);
      const end = new Date(endDate);
      
      while (currentDate <= end) {
        days.push(generateMockMarketData(new Date(currentDate)));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      return {
        symbol,
        data: days,
        metadata: {
          totalDays: days.length,
          averageVolume: days.reduce((sum, day) => sum + day.volume, 0) / days.length,
          averageVolatility: days.reduce((sum, day) => sum + day.volatility, 0) / days.length,
        }
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching real-time orderbook data
export const fetchOrderbookData = createAsyncThunk(
  'marketData/fetchOrderbookData',
  async (symbol = 'BTCUSDT', { rejectWithValue }) => {
    try {
      // Mock orderbook data for demo
      const mockOrderbook = {
        symbol,
        timestamp: Date.now(),
        bids: Array.from({ length: 10 }, (_, i) => [
          (50000 - i * 10).toFixed(2),
          (Math.random() * 10).toFixed(4)
        ]),
        asks: Array.from({ length: 10 }, (_, i) => [
          (50000 + i * 10).toFixed(2),
          (Math.random() * 10).toFixed(4)
        ]),
      };
      
      return mockOrderbook;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  marketData: {},
  orderbookData: {},
  selectedSymbol: 'BTCUSDT',
  availableSymbols: ['BTCUSDT', 'ETHUSDT', 'ADAUSDT', 'DOTUSDT', 'LINKUSDT'],
  timeframes: ['1d', '1w', '1M'],
  currentTimeframe: '1d',
  isLoading: false,
  error: null,
  filters: {
    volatilityRange: [0, 1],
    volumeRange: [0, 1000000],
    performanceRange: [-0.1, 0.1],
  },
};

const marketDataSlice = createSlice({
  name: 'marketData',
  initialState,
  reducers: {
    setSelectedSymbol: (state, action) => {
      state.selectedSymbol = action.payload;
    },
    setCurrentTimeframe: (state, action) => {
      state.currentTimeframe = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearMarketData: (state) => {
      state.marketData = {};
      state.orderbookData = {};
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMarketData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMarketData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.marketData[action.payload.symbol] = action.payload;
      })
      .addCase(fetchMarketData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchOrderbookData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOrderbookData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderbookData[action.payload.symbol] = action.payload;
      })
      .addCase(fetchOrderbookData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setSelectedSymbol,
  setCurrentTimeframe,
  setFilters,
  clearMarketData,
  setLoading,
  setError,
} = marketDataSlice.actions;

export default marketDataSlice.reducer; 