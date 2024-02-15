import { AppConfig } from '../types/App';
import { RunningTask, Task } from '../types/Task';

export type ConfigSlice = {
  config: AppConfig;
  setConfig: (config: Partial<AppConfig>) => void;
  initApp: () => void;
};

export type TaskSlice = {
  isLoading: boolean;
  todoTasks: Task[];
  doneTasks: Task[];
  selectedTask: Task | null;
  runningTask: RunningTask | null;
  filteredTasks: Task[];
  databaseId: string;
  loadTasks: () => void;
  getTask: (taskId: string) => void;
  updateTask: (task: Partial<Task>) => void;
  deleteTask: (task: Task) => void;
  addTask: (task: Task) => void;
  quickAddTask: (task: Task) => void;
  selectTasks: () => void;
  startTask: (task: Task) => void;
  continueRunning: (task: Task) => void;
  pauseRunning: (task: Task) => void;
  stopRunning: (task: Task) => void;
  finishRunning: (task: Task) => void;
  searchBy: (term: string) => void;
};
