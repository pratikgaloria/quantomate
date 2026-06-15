import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { PageProvider } from './context/PageContext';
import { Sidebar } from './components/Sidebar';
import { AppHeader } from './components/AppHeader';
import { PageToolbar } from './components/PageToolbar';
import { BacktestPage } from './pages/BacktestPage';
import { ScreenerPage } from './pages/ScreenerPage';
import { StrategiesPage } from './pages/StrategiesPage';
import { TradingPage } from './pages/TradingPage';
import { IndicatorVisualizationPage } from './pages/IndicatorVisualizationPage';
import './styles/App.scss';

function App() {
  return (
    <Router>
      <PageProvider>
        <div className="app-shell">
          {/* 60px icon sidebar */}
          <Sidebar />

          {/* Right: header + toolbar + scrollable content */}
          <div className="app-shell__right">
            <AppHeader />
            <PageToolbar />
            <main className="app-shell__content">
              <Routes>
                <Route path="/" element={<Navigate to="/backtest" replace />} />
                <Route path="/backtest"   element={<BacktestPage />} />
                <Route path="/screener"   element={<ScreenerPage />} />
                <Route path="/strategies" element={<StrategiesPage />} />
                <Route path="/trade"      element={<TradingPage />} />
                <Route path="/indicators" element={<IndicatorVisualizationPage />} />
              </Routes>
            </main>
          </div>
        </div>
      </PageProvider>
    </Router>
  );
}

export default App;
