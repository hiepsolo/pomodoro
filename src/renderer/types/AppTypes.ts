export type AppConfig = {
  notionKey: string;
  notionWorkspace: string;
};

export type AppContextType = {
  config: AppConfig;
  setConfig: (config: AppConfig) => void;
};
