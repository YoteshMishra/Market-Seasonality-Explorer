import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { format } from 'date-fns';
import { Download, FileText, Image, FileSpreadsheet, X } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { hideModal } from '../store/slices/uiSlice';

const ExportModal = () => {
  const dispatch = useDispatch();
  const { selectedDate, selectedRange, viewMode } = useSelector(state => state.calendar);
  const { marketData, selectedSymbol } = useSelector(state => state.marketData);
  
  const [exportType, setExportType] = useState('pdf');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeData, setIncludeData] = useState(true);
  const [dateRange, setDateRange] = useState('selected');
  const [isExporting, setIsExporting] = useState(false);
  
  const calendarRef = useRef(null);

  const symbolData = marketData[selectedSymbol]?.data || [];

  const exportOptions = [
    {
      id: 'pdf',
      name: 'PDF Report',
      icon: FileText,
      description: 'Export as PDF with charts and data'
    },
    {
      id: 'csv',
      name: 'CSV Data',
      icon: FileSpreadsheet,
      description: 'Export raw data as CSV file'
    },
    {
      id: 'image',
      name: 'Image',
      icon: Image,
      description: 'Export calendar as image'
    }
  ];

  const getDateRangeData = () => {
    if (dateRange === 'selected' && selectedDate) {
      return symbolData.filter(day => day.date === format(selectedDate, 'yyyy-MM-dd'));
    } else if (dateRange === 'range' && selectedRange.start && selectedRange.end) {
      return symbolData.filter(day => {
        const dayDate = new Date(day.date);
        return dayDate >= selectedRange.start && dayDate <= selectedRange.end;
      });
    } else {
      return symbolData.slice(-30); // Last 30 days
    }
  };

  const exportToPDF = async () => {
    setIsExporting(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Add title
      pdf.setFontSize(20);
      pdf.text('Market Seasonality Report', pageWidth / 2, 20, { align: 'center' });
      
      // Add metadata
      pdf.setFontSize(12);
      pdf.text(`Symbol: ${selectedSymbol}`, 20, 40);
      pdf.text(`Date Range: ${dateRange}`, 20, 50);
      pdf.text(`Generated: ${format(new Date(), 'yyyy-MM-dd HH:mm')}`, 20, 60);
      
      // Add summary statistics
      const data = getDateRangeData();
      if (data.length > 0) {
        const avgPrice = data.reduce((sum, day) => sum + day.close, 0) / data.length;
        const avgVolume = data.reduce((sum, day) => sum + day.volume, 0) / data.length;
        const avgVolatility = data.reduce((sum, day) => sum + day.volatility, 0) / data.length;
        const totalReturn = data.reduce((sum, day) => sum + day.performance, 0);
        
        pdf.setFontSize(14);
        pdf.text('Summary Statistics', 20, 80);
        pdf.setFontSize(10);
        pdf.text(`Average Price: $${avgPrice.toFixed(2)}`, 20, 90);
        pdf.text(`Average Volume: ${(avgVolume / 1000000).toFixed(2)}M`, 20, 100);
        pdf.text(`Average Volatility: ${(avgVolatility * 100).toFixed(1)}%`, 20, 110);
        pdf.text(`Total Return: ${(totalReturn * 100).toFixed(2)}%`, 20, 120);
      }
      
      // Add data table
      if (includeData && data.length > 0) {
        pdf.addPage();
        pdf.setFontSize(14);
        pdf.text('Market Data', 20, 20);
        
        const headers = ['Date', 'Open', 'High', 'Low', 'Close', 'Volume', 'Volatility', 'Performance'];
        const startY = 40;
        const colWidth = pageWidth / headers.length;
        
        // Headers
        pdf.setFontSize(10);
        headers.forEach((header, i) => {
          pdf.text(header, 20 + i * colWidth, startY);
        });
        
        // Data rows
        data.slice(0, 20).forEach((day, rowIndex) => {
          const y = startY + 10 + rowIndex * 8;
          if (y > pageHeight - 20) {
            pdf.addPage();
            return;
          }
          
          pdf.text(format(new Date(day.date), 'MM/dd'), 20, y);
          pdf.text(`$${day.open.toFixed(2)}`, 20 + colWidth, y);
          pdf.text(`$${day.high.toFixed(2)}`, 20 + colWidth * 2, y);
          pdf.text(`$${day.low.toFixed(2)}`, 20 + colWidth * 3, y);
          pdf.text(`$${day.close.toFixed(2)}`, 20 + colWidth * 4, y);
          pdf.text(`${(day.volume / 1000000).toFixed(1)}M`, 20 + colWidth * 5, y);
          pdf.text(`${(day.volatility * 100).toFixed(1)}%`, 20 + colWidth * 6, y);
          pdf.text(`${(day.performance * 100).toFixed(2)}%`, 20 + colWidth * 7, y);
        });
      }
      
      pdf.save(`market-report-${selectedSymbol}-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    } catch (error) {
      console.error('PDF export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportToCSV = () => {
    setIsExporting(true);
    try {
      const data = getDateRangeData();
      const headers = ['Date', 'Open', 'High', 'Low', 'Close', 'Volume', 'Volatility', 'Performance', 'VIX', 'RSI'];
      
      let csvContent = headers.join(',') + '\n';
      
      data.forEach(day => {
        const row = [
          day.date,
          day.open.toFixed(2),
          day.high.toFixed(2),
          day.low.toFixed(2),
          day.close.toFixed(2),
          day.volume.toFixed(0),
          (day.volatility * 100).toFixed(2),
          (day.performance * 100).toFixed(2),
          day.vix.toFixed(1),
          day.rsi.toFixed(1)
        ];
        csvContent += row.join(',') + '\n';
      });
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `market-data-${selectedSymbol}-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('CSV export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportToImage = async () => {
    setIsExporting(true);
    try {
      if (calendarRef.current) {
        const canvas = await html2canvas(calendarRef.current, {
          scale: 2,
          useCORS: true,
          allowTaint: true
        });
        
        const link = document.createElement('a');
        link.download = `calendar-${selectedSymbol}-${format(new Date(), 'yyyy-MM-dd')}.png`;
        link.href = canvas.toDataURL();
        link.click();
      }
    } catch (error) {
      console.error('Image export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExport = () => {
    switch (exportType) {
      case 'pdf':
        exportToPDF();
        break;
      case 'csv':
        exportToCSV();
        break;
      case 'image':
        exportToImage();
        break;
      default:
        break;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-2 sm:px-0">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-0 sm:mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Export Data</h2>
          <button
            onClick={() => dispatch(hideModal())}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Export Type Selection */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Export Format</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
              {exportOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={() => setExportType(option.id)}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      exportType === option.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-6 h-6 ${
                        exportType === option.id ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                      <div>
                        <div className="font-medium text-gray-900">{option.name}</div>
                        <div className="text-sm text-gray-500">{option.description}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Export Options */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Export Options</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Date Range</label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="selected">Selected Date</option>
                  <option value="range">Selected Range</option>
                  <option value="last30">Last 30 Days</option>
                </select>
              </div>

              {exportType === 'pdf' && (
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={includeCharts}
                      onChange={(e) => setIncludeCharts(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Include Charts</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={includeData}
                      onChange={(e) => setIncludeData(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Include Data Table</span>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Preview */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 space-y-1">
                <div>Symbol: {selectedSymbol}</div>
                <div>View Mode: {viewMode}</div>
                <div>Date Range: {dateRange}</div>
                <div>Data Points: {getDateRangeData().length}</div>
              </div>
            </div>
          </div>

          {/* Export Button */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => dispatch(hideModal())}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Exporting...' : 'Export'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hidden calendar element for image export */}
      <div ref={calendarRef} className="hidden">
        {/* This will be populated with the actual calendar content */}
      </div>
    </div>
  );
};

export default ExportModal; 