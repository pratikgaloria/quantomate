import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { BacktestPage } from './pages/BacktestPage';
import { ScreenerPage } from './pages/ScreenerPage';
import { DashboardPage } from './pages/DashboardPage';
import './styles/App.scss';

function App() {
  return (
    <Router>
      <div className="app">
        <div className="app-container">
          <Sidebar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/backtest" element={<BacktestPage />} />
              <Route path="/screener" element={<ScreenerPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
