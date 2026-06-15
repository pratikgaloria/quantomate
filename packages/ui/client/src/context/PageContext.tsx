import { createContext, useContext, useState, ReactNode, FC } from 'react';

interface PageContextValue {
  pageTitle: string;
  setPageTitle: (title: string) => void;
  toolbar: ReactNode;
  setToolbar: (node: ReactNode) => void;
}

const PageContext = createContext<PageContextValue>({
  pageTitle: '',
  setPageTitle: () => {},
  toolbar: null,
  setToolbar: () => {},
});

export const PageProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [pageTitle, setPageTitle] = useState('');
  const [toolbar, setToolbar] = useState<ReactNode>(null);

  return (
    <PageContext.Provider value={{ pageTitle, setPageTitle, toolbar, setToolbar }}>
      {children}
    </PageContext.Provider>
  );
};

export const usePageContext = () => useContext(PageContext);
