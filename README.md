# Market Seasonality Explorer

A comprehensive React application for visualizing historical volatility, liquidity, and performance data across different time periods for financial instruments.

## 🚀 Features

### Core Requirements ✅

1. **Interactive Calendar Component**
   - Daily, weekly, and monthly views
   - Smooth transitions between time periods
   - Navigation between months/years
   - Today's date with visual indicators
   - Keyboard navigation (arrow keys, enter, escape)

2. **Data Visualization Layers**
   - Volatility Heatmap (Green/Yellow/Red shades)
   - Liquidity Indicators (Volume bars and patterns)
   - Performance Metrics (Upward/downward arrows)

3. **Multi-Timeframe Support**
   - Daily View: Detailed metrics for each day
   - Weekly View: Aggregated weekly summaries
   - Monthly View: Monthly overview with key metrics

4. **Interactive Features**
   - Hover Effects: Detailed tooltips with metrics
   - Click Interactions: Date selection for detailed breakdowns
   - Selection Mode: Date range selection for analysis
   - Filter Controls: Financial instruments and time periods
   - Zoom Functionality: Zoom-in/zoom-out for detailed analysis

5. **Data Dashboard Panel**
   - Comprehensive metrics display
   - OHLC (Open, High, Low, Close) prices
   - Volume and liquidity metrics
   - Volatility calculations
   - Technical indicators (RSI, Moving Averages)

6. **Responsive Design**
   - Mobile-friendly interface
   - Touch-friendly interactions
   - Optimized for different screen orientations
   - Maintains readability on small screens

### Bonus Features ✅

- **Export Functionality**: PDF, CSV, and image export
- **Custom Color Schemes**: Default, high contrast, colorblind-friendly themes
- **Alert System**: Threshold-based alerts for volatility and performance
- **Animation Effects**: Smooth transitions and interactions
- **Integration Ready**: Prepared for real API integration

## 🛠️ Technology Stack

- **React 18** with Create React App
- **Redux Toolkit** for state management
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **date-fns** for date manipulation
- **Lucide React** for icons
- **html2canvas** & **jsPDF** for export functionality

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd market-seasonality-explorer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎯 Usage Guide

### Basic Navigation
- **Calendar Views**: Switch between Daily, Weekly, and Monthly views using the toggle buttons
- **Navigation**: Use arrow buttons or keyboard arrows to navigate between periods
- **Date Selection**: Click on any date to view detailed information
- **Range Selection**: Use the "Select Range" button to select multiple dates

### Interactive Features
- **Hover**: Hover over calendar cells to see detailed tooltips
- **Zoom**: Use the zoom controls to magnify the calendar view
- **Keyboard Shortcuts**:
  - `← →`: Navigate days
  - `↑ ↓`: Navigate weeks
  - `Enter`: Toggle range selection
  - `Escape`: Cancel selection

### Advanced Features
- **Export Data**: Click the export button to download data as PDF, CSV, or image
- **Theme Switching**: Use the theme switcher for different color schemes
- **Alert System**: Set up alerts for specific volatility or performance thresholds
- **Filters**: Use the sidebar filters to customize data display

## 📊 Data Structure

The application uses mock data with the following structure:

```javascript
{
  date: "2024-01-01",
  open: 50000.00,
  high: 51000.00,
  low: 49000.00,
  close: 50500.00,
  volume: 1000000,
  volatility: 0.45,
  liquidity: 0.75,
  performance: 0.02,
  vix: 25.5,
  rsi: 65.2,
  movingAverage20: 50200.00,
  movingAverage50: 49800.00
}
```

## 🎨 Themes

The application supports multiple color themes:

1. **Default**: Standard color scheme
2. **High Contrast**: Enhanced visibility for accessibility
3. **Colorblind Friendly**: Accessible colors for color vision deficiency
4. **Dark Mode**: Low-light environment theme

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=your_api_url_here
REACT_APP_API_KEY=your_api_key_here
```

### Customization
- Modify `src/store/slices/marketDataSlice.js` to integrate with real APIs
- Update `src/components/Calendar.js` for custom calendar behavior
- Customize themes in `src/index.css`

## 🧪 Testing

Run the test suite:

```bash
npm test
```

Run the feature verification script:

```bash
node src/test-features.js
```

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## ♿ Accessibility

- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: ARIA labels and semantic HTML
- **High Contrast**: Enhanced visibility themes
- **Colorblind Support**: Accessible color schemes
- **Reduced Motion**: Respects user preferences

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`

### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`

## 📈 Performance Optimizations

- **Lazy Loading**: Components load on demand
- **Memoization**: React.memo and useMemo for performance
- **Virtual Scrolling**: Efficient rendering of large datasets
- **Code Splitting**: Automatic code splitting with React.lazy

## 🔒 Security

- **Input Validation**: All user inputs are validated
- **XSS Protection**: React's built-in XSS protection
- **API Security**: Prepared for secure API integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **Recharts** for the charting library
- **Lucide** for the beautiful icons

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact: [your-email@example.com]

## 🔄 Version History

- **v1.0.0**: Initial release with all core features
- **v1.1.0**: Added bonus features and accessibility improvements
- **v1.2.0**: Performance optimizations and mobile enhancements

---

**Made with ❤️ for the financial data visualization community** 