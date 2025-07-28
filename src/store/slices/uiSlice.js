import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: 'light', // 'light', 'dark', 'high-contrast'
  sidebarOpen: false,
  modalOpen: false,
  modalType: null, // 'details', 'export', 'settings', 'filters'
  tooltip: {
    visible: false,
    content: '',
    position: { x: 0, y: 0 },
  },
  notifications: [],
  zoomLevel: 1,
  selectedDateRange: null,
  exportSettings: {
    format: 'pdf', // 'pdf', 'csv', 'png'
    includeCharts: true,
    includeData: true,
  },
  alerts: {
    volatilityThreshold: 0.7,
    volumeThreshold: 500000,
    performanceThreshold: 0.05,
    enabled: false,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    openModal: (state, action) => {
      state.modalOpen = true;
      state.modalType = action.payload;
    },
    closeModal: (state) => {
      state.modalOpen = false;
      state.modalType = null;
    },
    hideModal: (state) => {
      state.modalOpen = false;
      state.modalType = null;
    },
    showTooltip: (state, action) => {
      state.tooltip = {
        visible: true,
        content: action.payload.content,
        position: action.payload.position,
      };
    },
    hideTooltip: (state) => {
      state.tooltip.visible = false;
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        type: action.payload.type || 'info',
        message: action.payload.message,
        duration: action.payload.duration || 5000,
      });
    },
    showNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        type: action.payload.type || 'info',
        title: action.payload.title,
        message: action.payload.message,
        duration: action.payload.duration || 5000,
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    setZoomLevel: (state, action) => {
      state.zoomLevel = Math.max(0.5, Math.min(2, action.payload));
    },
    setSelectedDateRange: (state, action) => {
      state.selectedDateRange = action.payload;
    },
    setExportSettings: (state, action) => {
      state.exportSettings = { ...state.exportSettings, ...action.payload };
    },
    setAlerts: (state, action) => {
      state.alerts = { ...state.alerts, ...action.payload };
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const {
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  openModal,
  closeModal,
  hideModal,
  showTooltip,
  hideTooltip,
  addNotification,
  showNotification,
  removeNotification,
  setZoomLevel,
  setSelectedDateRange,
  setExportSettings,
  setAlerts,
  clearNotifications,
} = uiSlice.actions;

export default uiSlice.reducer; 