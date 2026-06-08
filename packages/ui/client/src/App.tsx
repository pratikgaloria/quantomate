import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { BacktestPage } from './pages/BacktestPage';
import { ScreenerPage } from './pages/ScreenerPage';
import { SimulationPage } from './pages/SimulationPage';
import { TradingPage } from './pages/TradingPage';
import './styles/App.scss';

function App() {
  return (
    <Router>
      <div className="app">
        <div className="app-container">
          <Sidebar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Navigate to="/backtest" replace />} />
              <Route path="/backtest" element={<BacktestPage />} />
              <Route path="/screener" element={<ScreenerPage />} />
              <Route path="/simulation" element={<SimulationPage />} />
              <Route path="/trade" element={<TradingPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
