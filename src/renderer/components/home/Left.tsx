/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import {
  GearIcon,
  PauseIcon,
  PlayIcon,
  ReloadIcon,
  StopIcon,
} from '@radix-ui/react-icons';
import { useDebounce } from 'use-debounce';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@radix-ui/react-popover';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Task } from '../../types/Task';
import { Input } from '../ui/input';

// eslint-disable-next-line react/function-component-definition
const Left = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [inProgressTask, setInProgressTask] = useState<Task | null>(null);
  const [pausedTask, setPausedTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([
    {
      name: 'Việc 1',
      description: 'Việc 1 desc',
      status: 'todo',
    },
    { name: 'Việc 2', description: 'Mô tả 2', status: 'todo' },
    { name: 'Việc 3', description: 'Mô tả 3', status: 'todo' },
    { name: 'Việc 4', description: 'Mô tả 4', status: 'todo' },
    { name: 'Việc 5', description: 'Mô tả 5', status: 'todo' },
    { name: 'Việc 6', description: 'Mô tả 6', status: 'todo' },
    {
      name: 'Việc 7',
      description: 'Mô tả 7',
      status: 'done',
    },
  ]);
  const todoTasks =
    tasks && tasks.length > 0
      ? tasks.filter((task) => {
          if (!debouncedSearchTerm) {
            return task.status === 'todo';
          }
          return (
            task.status === 'todo' &&
            task.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
          );
        })
      : [];
  const selectTask = (task: Task) => () => {
    setSearchTerm('');
    setInProgressTask(task);
    setTasks(tasks.filter((t) => t.name !== task.name));
  };

  const continueRunning = () => () => {
    setInProgressTask(pausedTask);
    setPausedTask(null);
  };

  const pauseRunning = () => () => {
    setInProgressTask(null);
    setPausedTask(inProgressTask);
  };

  const stopRunning = () => () => {
    setInProgressTask(null);
    setPausedTask(null);
    setTasks(
      [...tasks, pausedTask as Task].sort((a, b) => (a.name > b.name ? 1 : -1)),
    );
  };

  const handleSearchTermChange = (e: any) => {
    setSearchTerm(e.target.value);
  };

  const createTask = () => {
    // TODO call to API later
    setTasks([
      ...tasks,
      { name: debouncedSearchTerm, status: 'todo', description: '' },
    ]);
  };
  return (
    <div className="col-span-3 relative">
      <div className="absolute z-20 left-0 top-0 flex gap-4">
        <Button
          variant="link"
          className="flex items-center hover:text-slate-400 hover:transition-colors hover:no-underline text-md font-medium"
        >
          <ReloadIcon className="mr-2 h-4 w-4" /> Cập nhật
        </Button>
        <Link
          to="/"
          className="flex items-center hover:text-slate-400 hover:transition-colors text-md font-medium"
        >
          <GearIcon className="mr-2 h-4 w-4" /> Cài đặt
        </Link>
      </div>
      <div className="absolute z-10 w-full h-screen flex justify-center items-center">
        {inProgressTask && (
          <div className="flex flex-col gap-8 items-center">
            <div
              id="count-down"
              className="flex items-center justify-center h-40 w-40 rounded-full border-2 border-slate-600"
            >
              25:00
            </div>
            <Button
              onClick={pauseRunning()}
              className="bg-yellow-400 hover:bg-yellow-300"
            >
              <PauseIcon className="mr-2 h-4 w-4" /> Tạm dừng
            </Button>
          </div>
        )}
        {pausedTask && (
          <div className="flex flex-col gap-8 items-center">
            <div
              id="count-down"
              className="flex items-center justify-center h-40 w-40 rounded-full border-2 border-slate-600"
            >
              25:00
            </div>
            <div className="flex w-32 flex-col gap-2 items-center">
              <Button
                onClick={continueRunning()}
                className="w-full bg-blue-400 hover:bg-blue-300"
              >
                <PlayIcon className="mr-2 h-4 w-4" /> Tiếp tục
              </Button>
              <Button
                onClick={stopRunning()}
                className="w-full bg-red-400 hover:bg-red-300"
              >
                <StopIcon className="mr-2 h-4 w-4" /> Tạm dừng
              </Button>
            </div>
          </div>
        )}
        {!inProgressTask && !pausedTask && (
          <Popover>
            <PopoverTrigger asChild>
              <Button className="w-32">
                <PlayIcon className="mr-2 h-4 w-4" /> Bắt đầu
              </Button>
            </PopoverTrigger>
            <PopoverContent sideOffset={3} className="w-80">
              <Input
                value={searchTerm}
                onChange={handleSearchTermChange}
                placeholder="Chọn/Tạo 1 việc"
              />
              <div className="flex p-4 mt-1 flex-col gap-2 max-h-60 overflow-y-auto drop-shadow-sm border border-slate-200 rounded-md">
                {todoTasks.map((task, idx) => (
                  <div
                    key={task.name}
                    className="p-2 hover:cursor-pointer hover:bg-slate-100"
                    onClick={selectTask(task)}
                    onKeyUp={() => {}}
                    role="menuitem"
                    tabIndex={idx}
                  >
                    {task.name}
                  </div>
                ))}
                {todoTasks.length === 0 && (
                  <div
                    onClick={createTask}
                    className="p-2 hover:cursor-pointer hover:bg-blue-100"
                  >
                    <Button
                      onClick={createTask}
                      variant="link"
                      className="text-blue-500"
                    >
                      Tạo mới
                    </Button>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
};

export default Left;
