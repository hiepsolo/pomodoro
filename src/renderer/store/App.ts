/* eslint-disable import/prefer-default-export */
import { createContext } from 'react';
import { AppContextType } from '../types/AppTypes';

export const AppContext = createContext<AppContextType>({
  config: {
    notionKey: '',
    notionWorkspace: '',
  },
  setConfig: () => {},
});
