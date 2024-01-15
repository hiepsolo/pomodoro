import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { useCallback, useMemo, useState } from 'react';
import Setup from './screens/setup';
import { AppConfig, AppContextType } from './types/AppTypes';
import { AppContext } from './store/App';
import Home from './screens/home';

export default function App() {
  const [config, setConfig] = useState<AppConfig>({
    notionKey: '',
    notionWorkspace: '',
  });
  const overrideConfig = useCallback((newConfig: AppConfig) => {
    setConfig(newConfig);
  }, []);
  const appConfig: AppContextType = useMemo<AppContextType>(
    () => ({
      config,
      setConfig: overrideConfig,
    }),
    [config, overrideConfig],
  );
  return (
    <AppContext.Provider value={appConfig}>
      <Router>
        <Routes>
          <Route path="/" element={<Setup />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </Router>
    </AppContext.Provider>
  );
}
