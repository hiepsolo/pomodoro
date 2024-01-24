/* eslint-disable import/prefer-default-export */
import { create, StateCreator } from 'zustand';
import { nanoid } from 'nanoid';
import { ConfigSlice, TaskSlice } from './slices';

const CONFIG_KEY = 'config';

const createConfigSlice: StateCreator<ConfigSlice, [], [], ConfigSlice> = (
  set,
) => {
  const configData = localStorage.getItem(CONFIG_KEY);
  const configObj = configData
    ? JSON.parse(configData)
    : {
        notionKey: '',
        notionWorkspace: '',
        timeLimit: 25,
      };
  return {
    config: configObj,
    setConfig: (config) =>
      set(() => {
        localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
        return { config };
      }),
  };
};
const createTaskSlice: StateCreator<TaskSlice, [], [], TaskSlice> = (set) => ({
  todoTasks: [
    {
      id: nanoid(),
      name: 'Việc 1',
      description: 'Việc 1 desc',
      status: 'todo',
    },
    { id: nanoid(), name: 'Việc 2', description: 'Mô tả 2', status: 'todo' },
    { id: nanoid(), name: 'Việc 3', description: 'Mô tả 3', status: 'todo' },
    { id: nanoid(), name: 'Việc 4', description: 'Mô tả 4', status: 'todo' },
    { id: nanoid(), name: 'Việc 5', description: 'Mô tả 5', status: 'todo' },
    { id: nanoid(), name: 'Việc 6', description: 'Mô tả 6', status: 'todo' },
  ],
  doneTasks: [],
  runningTask: null,
  selectedTask: null,
  filteredTasks: [],
  updateTask: (task) =>
    set((state) => {
      state.todoTasks.forEach((t, index) => {
        if (t.id === task.id) {
          state.todoTasks[index] = { ...state.todoTasks[index], ...task };
          console.log(
            '🚀 ~ state.todoTasks.forEach ~ { ...state.todoTasks[index], ...task }:',
            { ...state.todoTasks[index], ...task },
          );
          console.log(
            '🚀 ~ state.todoTasks.forEach ~ state.todoTasks[index]:',
            state.todoTasks[index],
          );
        }
      });
      return {
        todoTasks: [...state.todoTasks],
      };
    }),
  addTask: (task) =>
    set((state) => {
      state.todoTasks.push(task);
      return {
        todoTasks: [...state.todoTasks],
      };
    }),
  quickAddTask: (task) =>
    set((state) => {
      state.todoTasks.push(task);
      return {
        todoTasks: [...state.todoTasks],
        runningTask: {
          task,
          status: 'running',
          count: 0,
        },
      };
    }),
  getTask: (taskId) =>
    set((state) => {
      return {
        selectedTask:
          state.todoTasks.find((task) => task.id === taskId) || null,
      };
    }),
  deleteTask: (task) =>
    set((state) => {
      const deletedIndex = state.todoTasks.findIndex((t) => t.id === task.id);
      if (deletedIndex >= 0) {
        state.todoTasks.splice(deletedIndex, 1);
      }
      return {
        todoTasks: [...state.todoTasks],
      };
    }),
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
