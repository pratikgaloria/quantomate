import { NavLink } from 'react-router-dom';
import './Sidebar.scss';

export function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <i className="la la-layer-group"></i>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/backtest" className={({ isActive }) => isActive ? 'active' : ''}>
          <i className="la la-chart-area"></i>
          <span>Backtest</span>
        </NavLink>
        <NavLink to="/screener" className={({ isActive }) => isActive ? 'active' : ''}>
          <i className="la la-filter"></i>
          <span>Screener</span>
        </NavLink>
        <NavLink to="/simulation" className={({ isActive }) => isActive ? 'active' : ''}>
          <i className="la la-play-circle"></i>
          <span>Simulator</span>
        </NavLink>
        <NavLink to="/trade" className={({ isActive }) => isActive ? 'active' : ''}>
          <i className="la la-exchange-alt"></i>
          <span>Trading</span>
        </NavLink>
      </nav>
    </div>
  );
}
