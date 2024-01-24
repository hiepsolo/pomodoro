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
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { nanoid } from 'nanoid';
import { Button } from '../ui/button';
import { Task } from '../../types/Task';
import { Input } from '../ui/input';
import { useAppStore } from '../../store/app';
import CountDown from './Count-Down';

// eslint-disable-next-line react/function-component-definition
const Left = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const {
    runningTask,
    filteredTasks,
    quickAddTask,
    selectTask,
    startTask,
    continueRunning,
    pauseRunning,
    stopRunning,
    searchBy,
  } = useAppStore(
    useShallow((state) => ({
      filteredTasks: state.filteredTasks,
      runningTask: state.runningTask,
      quickAddTask: state.quickAddTask,
      selectTask: state.startTask,
      continueRunning: state.continueRunning,
      pauseRunning: state.pauseRunning,
      stopRunning: state.stopRunning,
      finishRunning: state.finishRunning,
      searchBy: state.searchBy,
      startTask: state.selectTasks,
    })),
  );
  useEffect(() => {
    searchBy(debouncedSearchTerm);
  }, [debouncedSearchTerm, searchBy]);

  const handleSelectTask = (task: Task) => () => {
    setSearchTerm('');
    selectTask(task);
  };

  const handleContinueRunning = () => () => {
    if (runningTask) {
      continueRunning(runningTask.task);
    }
  };

  const handlePauseRunning = () => () => {
    if (runningTask) {
      pauseRunning(runningTask.task);
    }
  };

  const handleStopRunning = () => () => {
    if (runningTask) {
      stopRunning(runningTask.task);
    }
  };

  const handleSearchTermChange = (e: any) => {
    setSearchTerm(e.target.value);
  };

  const handleStartClick = () => {
    startTask();
  };

  const createTask = () => {
    quickAddTask({
      id: nanoid(),
      name: debouncedSearchTerm,
      status: 'todo',
      description: '',
    });
    setSearchTerm('');
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
        <div className="flex flex-col gap-8 items-center">
          {runningTask && <CountDown />}
          {runningTask && runningTask.status === 'running' && (
            <Button
              onClick={handlePauseRunning()}
              className="bg-yellow-400 hover:bg-yellow-300"
            >
              <PauseIcon className="mr-2 h-4 w-4" /> Tạm dừng
            </Button>
          )}
          {runningTask && runningTask.status === 'paused' && (
            <div className="flex w-32 flex-col gap-2 items-center">
              <Button
                onClick={handleContinueRunning()}
                className="w-full bg-blue-400 hover:bg-blue-300"
              >
                <PlayIcon className="mr-2 h-4 w-4" /> Tiếp tục
              </Button>
              <Button
                onClick={handleStopRunning()}
                className="w-full bg-red-400 hover:bg-red-300"
              >
                <StopIcon className="mr-2 h-4 w-4" /> Dừng
              </Button>
            </div>
          )}
        </div>
        {!runningTask && (
          <Popover>
            <PopoverTrigger asChild>
              <Button className="w-32" onClick={handleStartClick}>
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
                {filteredTasks.map((task, idx) => (
                  <div
                    key={task.id}
                    className="p-2 hover:cursor-pointer hover:bg-slate-100"
                    onClick={handleSelectTask(task)}
                    onKeyUp={() => {}}
                    role="menuitem"
                    tabIndex={idx}
                  >
                    {task.name}
                  </div>
                ))}
                {filteredTasks.length === 0 && (
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
