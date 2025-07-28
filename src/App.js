import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Calendar from './components/Calendar';
import Dashboard from './components/Dashboard';
import Modal from './components/Modal';
import NotificationSystem from './components/NotificationSystem';
import { fetchMarketData } from './store/slices/marketDataSlice';
import { format, subMonths, addMonths } from 'date-fns';

function App() {
  const dispatch = useDispatch();
  const { currentDate } = useSelector(state => state.calendar);
  const { selectedSymbol } = useSelector(state => state.marketData);
  const { sidebarOpen, modalOpen, modalType, theme } = useSelector(state => state.ui);

  useEffect(() => {
    // Load initial market data
    const startDate = format(subMonths(currentDate, 1), 'yyyy-MM-dd');
    const endDate = format(addMonths(currentDate, 1), 'yyyy-MM-dd');
    
    dispatch(fetchMarketData({
      symbol: selectedSymbol,
      startDate,
      endDate,
    }));
  }, [dispatch, selectedSymbol, currentDate]);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className={`min-h-screen bg-gray-50 transition-colors duration-200 ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-0 lg:ml-64' : 'ml-0'}`}>
          {/* Header */}
          <Header />
          
          {/* Main Content Area */}
          <main className="flex-1 overflow-auto p-2 sm:p-4 md:p-6">
            <div className="max-w-7xl mx-auto w-full">
              <div className="grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-3">
                {/* Calendar Section */}
                <div className="md:col-span-2">
                  <Calendar />
                </div>
                
                {/* Dashboard Section */}
                <div className="md:col-span-1">
                  <Dashboard />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && <Modal type={modalType} />}

      {/* Notifications */}
      <NotificationSystem />

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </div>
  );
}

export default App; 