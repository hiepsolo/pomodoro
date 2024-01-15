export type Task = {
  name: string;
  description: string;
  // todo, done
  status: 'todo' | 'done';
};
