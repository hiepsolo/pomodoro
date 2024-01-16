import { AppConfig } from '../types/App';
import { RunningTask, Task } from '../types/Task';

export type ConfigSlice = {
  config: AppConfig;
  setConfig: (config: AppConfig) => void;
};

export type TaskSlice = {
  todoTasks: Task[];
  doneTasks: Task[];
  runningTask: RunningTask | null;
  filteredTasks: Task[];
  updateTask: (task: Task) => void;
  deleteTask: (task: Task) => void;
  addTask: (task: Task) => void;
  selectTasks: () => void;
  startTask: (task: Task) => void;
  continueRunning: (task: Task) => void;
  pauseRunning: (task: Task) => void;
  stopRunning: (task: Task) => void;
  finishRunning: (task: Task) => void;
  searchBy: (term: string) => void;
};
