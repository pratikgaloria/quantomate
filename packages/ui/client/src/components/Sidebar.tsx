import { NavLink } from 'react-router-dom';
import './Sidebar.scss';

const NAV_ITEMS = [
  { to: '/backtest',   icon: 'la-chart-area',    label: 'Backtest'    },
  { to: '/screener',   icon: 'la-filter',         label: 'Screener'    },
  { to: '/strategies', icon: 'la-sliders-h',      label: 'Strategies'  },
  { to: '/trade',      icon: 'la-exchange-alt',   label: 'Trading'     },
  { to: '/indicators', icon: 'la-chart-bar',      label: 'Indicators'  },
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      {/* Logo mark */}
      <div className="sidebar__logo" title="Quantomate">
        <i className="la la-layer-group" />
      </div>

      {/* Navigation */}
      <nav className="sidebar__nav">
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            title={item.label}
            className={({ isActive }) =>
              `sidebar__link${isActive ? ' sidebar__link--active' : ''}`
            }
          >
            <i className={`la ${item.icon}`} />
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
