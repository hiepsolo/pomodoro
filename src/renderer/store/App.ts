/* eslint-disable import/prefer-default-export */
import { create, StateCreator } from 'zustand';
import { ConfigSlice, TaskSlice } from './slices';
import {
  addTask,
  deleteTask,
  getTasks,
  initDatabase,
  updateTask,
} from './apis';
import { Task } from '../types/Task';
import { AppConfig } from '../types/App';

const CONFIG_KEY = 'config';

const getConfigObj = (): AppConfig => {
  const configData = localStorage.getItem(CONFIG_KEY);
  const configObj = configData
    ? JSON.parse(configData)
    : {
        notionKey: '',
        notionWorkspace: '',
        timeLimit: 25,
        databaseId: '',
      };
  return configObj;
};

const createConfigSlice: StateCreator<ConfigSlice, [], [], ConfigSlice> = (
  set,
) => {
  const configObj = getConfigObj();
  return {
    config: configObj,
    setConfig: (config) => {
      const newConfig = {
        ...configObj,
        ...config,
      };
      return set(() => {
        localStorage.setItem(CONFIG_KEY, JSON.stringify(newConfig));
        return { config: newConfig };
      });
    },
    initApp: async () => {
      if (!configObj.databaseId) {
        try {
          const databaseId = await initDatabase(configObj.notionWorkspace);
          set(() => {
            const newConfig = {
              ...configObj,
              databaseId,
            };
            localStorage.setItem(CONFIG_KEY, JSON.stringify(newConfig));
            return { config: newConfig };
          });
        } catch (error) {
          console.error(error);
        }
      }
    },
  };
};

const createTaskSlice: StateCreator<TaskSlice, [], [], TaskSlice> = (set) => ({
  todoTasks: [],
  doneTasks: [],
  runningTask: null,
  selectedTask: null,
  filteredTasks: [],
  isLoading: false,
  databaseId: '',
  loadTasks: async () => {
    const configObj = getConfigObj();
    set(() => ({ isLoading: true, databaseId: configObj.databaseId }));
    try {
      const tasks: Task[] = await getTasks(configObj.databaseId);
      set(() => {
        return {
          todoTasks: tasks.filter((t) => t.status === 'todo'),
          doneTasks: tasks.filter((t) => t.status === 'done'),
          isLoading: false,
        };
      });
    } catch (error) {
      console.error(error);
      set(() => {
        return {
          isLoading: false,
        };
      });
    }
  },
  updateTask: async (task) => {
    const configObj = getConfigObj();
    try {
      await updateTask(configObj.databaseId, task.id!, task);
      set((state) => {
        state.todoTasks.forEach((t, index) => {
          if (t.id === task.id) {
            state.todoTasks[index] = { ...state.todoTasks[index], ...task };
          }
        });
        return {
          todoTasks: [...state.todoTasks],
        };
      });
    } catch (error) {
      console.error(error);
    }
  },
  addTask: async (task) => {
    const configObj = getConfigObj();
    try {
      const newTask = await addTask(configObj.databaseId, task);
      set((state) => {
        state.todoTasks.push(newTask);
        return {
          todoTasks: [...state.todoTasks],
        };
      });
    } catch (error) {
      console.error(error);
    }
  },
  quickAddTask: async (task) => {
    const configObj = getConfigObj();
    try {
      const newTask = await addTask(configObj.databaseId, task);
      set((state) => {
        state.todoTasks.push(newTask);
        return {
          todoTasks: [...state.todoTasks],
          runningTask: {
            task,
            status: 'running',
            count: 0,
          },
        };
      });
    } catch (error) {
      console.error(error);
    }
  },
  getTask: (taskId) =>
    set((state) => {
      return {
        selectedTask:
          state.todoTasks.find((task) => task.id === taskId) || null,
      };
    }),
  deleteTask: async (task) => {
    const configObj = getConfigObj();
    try {
      const deletedTask = await deleteTask(configObj.databaseId, task.id);
      set((state) => {
        const deletedIndex = state.todoTasks.findIndex((t) => t.id === task.id);
        if (deletedIndex >= 0) {
          state.todoTasks.splice(deletedIndex, 1);
        }
        return {
          todoTasks: [...state.todoTasks],
        };
      });
    } catch (error) {
      console.error(error);
    }
  },
  startTask: (task) =>
    set((state) => {
      // const selectedIndex = state.todoTasks.findIndex((t) => t.id === task.id);
      // state.todoTasks.splice(selectedIndex, 1);
      return {
        todoTasks: [...state.todoTasks],
        runningTask: {
          task,
          status: 'running',
          count: 0,
        },
      };
    }),
  selectTasks: () =>
    set((state) => {
      return {
        filteredTasks: state.todoTasks.sort((a, b) =>
          a.name > b.name ? 1 : -1,
        ),
      };
    }),
  continueRunning: (task) =>
    set((state) => {
      return {
        runningTask: {
          task,
          status: 'running',
        },
      };
    }),
  pauseRunning: (task) =>
    set((state) => {
      return {
        runningTask: {
          task,
          status: 'paused',
        },
      };
    }),
  stopRunning: () =>
    set((state) => {
      return {
        todoTasks: [...state.todoTasks],
        runningTask: null,
      };
    }),
  finishRunning: (task) =>
    set((state) => {
      const selectedIndex = state.todoTasks.findIndex((t) => t.id === task.id);
      state.doneTasks.push(task);
      state.todoTasks.splice(selectedIndex, 1);
      return {
        todoTasks: [...state.todoTasks],
        runningTask: null,
        doneTasks: [...state.doneTasks],
      };
    }),
  searchBy: (term) =>
    set((state) => {
      const filteredTasks = state.todoTasks.filter((task) => {
        if (!term) {
          return task.status === 'todo';
        }
        return (
          task.status === 'todo' &&
          task.name.toLowerCase().includes(term.toLowerCase())
        );
      });
      return {
        filteredTasks,
      };
    }),
});

export const useAppStore = create<ConfigSlice & TaskSlice>()((...a) => ({
  ...createConfigSlice(...a),
  ...createTaskSlice(...a),
}));
