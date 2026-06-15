import { FC } from 'react';
import { usePageContext } from '../context/PageContext';
import './AppHeader.scss';

export const AppHeader: FC = () => {
  const { pageTitle } = usePageContext();

  return (
    <header className="app-header">
      <div className="app-header__left">
        <span className="app-header__app-name">Quantomate</span>
        {pageTitle && (
          <>
            <span className="app-header__divider">/</span>
            <span className="app-header__page-title">{pageTitle}</span>
          </>
        )}
      </div>
      <div className="app-header__right">
        {/* Future: settings button, user menu, etc. */}
      </div>
    </header>
  );
};
