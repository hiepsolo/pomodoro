export type Task = {
  id: string;
  name: string;
  description: string;
  // todo, done
  status: 'todo' | 'done';
};
export type RunningTask = {
  task: Task;
  status: 'running' | 'paused';
};
