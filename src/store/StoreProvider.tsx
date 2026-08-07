'use client';

import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from './index';
import { SessionSynchronizer } from '@/components/auth/SessionSynchronizer';

interface StoreProviderProps {
  children: ReactNode;
}

export const StoreProvider = ({ children }: StoreProviderProps) => {
  return (
    <Provider store={store}>
      <SessionSynchronizer />
      {children}
    </Provider>
  );
};
