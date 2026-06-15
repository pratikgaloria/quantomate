import { FC } from 'react';
import { usePageContext } from '../context/PageContext';
import './PageToolbar.scss';

export const PageToolbar: FC = () => {
  const { toolbar } = usePageContext();

  if (!toolbar) return null;

  return (
    <div className="page-toolbar">
      {toolbar}
    </div>
  );
};
