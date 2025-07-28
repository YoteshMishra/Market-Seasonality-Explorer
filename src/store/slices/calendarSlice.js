import { createSlice } from '@reduxjs/toolkit';
import { startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, startOfWeek } from 'date-fns';

const initialState = {
  currentDate: new Date(),
  selectedDate: null,
  viewMode: 'daily', // 'daily', 'weekly', 'monthly'
  selectedRange: {
    start: null,
    end: null,
  },
  calendarDays: [],
  isLoading: false,
  error: null,
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setCurrentDate: (state, action) => {
      state.currentDate = action.payload;
      state.calendarDays = generateCalendarDays(action.payload, state.viewMode);
    },
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
      state.calendarDays = generateCalendarDays(state.currentDate, action.payload);
    },
    setSelectedRange: (state, action) => {
      state.selectedRange = action.payload;
    },
    clearSelection: (state) => {
      state.selectedDate = null;
      state.selectedRange = { start: null, end: null };
    },
    navigateMonth: (state, action) => {
      const { direction } = action.payload;
      const newDate = new Date(state.currentDate);
      
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      
      state.currentDate = newDate;
      state.calendarDays = generateCalendarDays(newDate, state.viewMode);
    },
    navigateYear: (state, action) => {
      const { direction } = action.payload;
      const newDate = new Date(state.currentDate);
      
      if (direction === 'prev') {
        newDate.setFullYear(newDate.getFullYear() - 1);
      } else {
        newDate.setFullYear(newDate.getFullYear() + 1);
      }
      
      state.currentDate = newDate;
      state.calendarDays = generateCalendarDays(newDate, state.viewMode);
    },
    navigateWeek: (state, action) => {
      const { direction } = action.payload;
      const newDate = new Date(state.currentDate);
      
      if (direction === 'prev') {
        newDate.setDate(newDate.getDate() - 7);
      } else {
        newDate.setDate(newDate.getDate() + 7);
      }
      
      state.currentDate = newDate;
      state.calendarDays = generateCalendarDays(newDate, state.viewMode);
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

// Helper function to generate calendar days
function generateCalendarDays(date, viewMode) {
  let start, end;
  
  if (viewMode === 'daily') {
    // Show full month view for daily mode
    start = startOfMonth(date);
    end = endOfMonth(date);
  } else if (viewMode === 'weekly') {
    // Show 4 weeks centered around the current date
    const weekStart = startOfWeek(date);
    start = new Date(weekStart);
    start.setDate(start.getDate() - 7); // Start 1 week before
    end = new Date(weekStart);
    end.setDate(end.getDate() + 20); // End 3 weeks after
  } else if (viewMode === 'monthly') {
    // Show 3 months centered around the current date
    start = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  } else {
    // Default to monthly view
    start = startOfMonth(date);
    end = endOfMonth(date);
  }
  
  const days = eachDayOfInterval({ start, end });
  
  // Add padding days for complete weeks
  const firstDayOfWeek = start.getDay();
  const lastDayOfWeek = end.getDay();
  
  const paddingStart = Array.from({ length: firstDayOfWeek }, (_, i) => {
    const paddingDate = new Date(start);
    paddingDate.setDate(paddingDate.getDate() - (firstDayOfWeek - i));
    return {
      date: paddingDate,
      isCurrentMonth: isSameMonth(paddingDate, date),
      isToday: isToday(paddingDate),
    };
  });
  
  const paddingEnd = Array.from({ length: 6 - lastDayOfWeek }, (_, i) => {
    const paddingDate = new Date(end);
    paddingDate.setDate(paddingDate.getDate() + i + 1);
    return {
      date: paddingDate,
      isCurrentMonth: isSameMonth(paddingDate, date),
      isToday: isToday(paddingDate),
    };
  });
  
  const currentMonthDays = days.map(day => ({
    date: day,
    isCurrentMonth: isSameMonth(day, date),
    isToday: isToday(day),
  }));
  
  return [...paddingStart, ...currentMonthDays, ...paddingEnd];
}

export const {
  setCurrentDate,
  setSelectedDate,
  setViewMode,
  setSelectedRange,
  clearSelection,
  navigateMonth,
  navigateYear,
  navigateWeek,
  setLoading,
  setError,
} = calendarSlice.actions;

export default calendarSlice.reducer; 