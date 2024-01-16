import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@components/ui/accordion';
import { PlayIcon, TrashIcon } from '@radix-ui/react-icons';
import { useShallow } from 'zustand/react/shallow';
import { Task } from '../../types/Task';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { useAppStore } from '../../store/app';
import clsx from 'clsx';

type Props = {};

type TaskProcessState = {
  task: Task;
  status: 'replace-running-task' | 'delete-task';
};

type DialogState = {
  title: string;
  content: string;
  btnConfirm: string;
};

const Right = (props: Props) => {
  const [processTaskState, setProcessTaskState] =
    useState<TaskProcessState | null>(null);
  const {
    todoTasks,
    doneTasks,
    runningTask,
    filteredTasks,
    addTask,
    selectTask,
    startTask,
    continueRunning,
    pauseRunning,
    stopRunning,
    finishRunning,
    removeTask,
    searchBy,
  } = useAppStore(
    useShallow((state) => ({
      todoTasks: state.todoTasks,
      doneTasks: state.doneTasks,
      runningTask: state.runningTask,
      addTask: state.addTask,
      continueRunning: state.continueRunning,
      pauseRunning: state.pauseRunning,
      stopRunning: state.stopRunning,
      finishRunning: state.finishRunning,
      removeTask: state.deleteTask,
      searchBy: state.searchBy,
      startTask: state.startTask,
    })),
  );
  const acceptTaskProcess = () => {
    setProcessTaskState(null);
    switch (processTaskState?.status) {
      case 'replace-running-task':
        startTask(processTaskState.task);
        break;
      default:
        if (runningTask !== null) {
          stopRunning(processTaskState!.task);
        }
        removeTask(processTaskState!.task);
        break;
    }
  };
  const cancelTaskProcess = () => {
    setProcessTaskState(null);
  };
  const handleDeleteTask = (task: Task) => () => {
    setProcessTaskState({
      task,
      status: 'delete-task',
    });
  };
  const handleStartTask = (task: Task) => () => {
    if (runningTask !== null) {
      setProcessTaskState({
        task,
        status: 'replace-running-task',
      });
    } else {
      startTask(task);
    }
  };
  const dlgState: DialogState =
    processTaskState && processTaskState.status === 'delete-task'
      ? {
          title: 'Xoá?',
          content: 'Bạn có chắc ko?',
          btnConfirm: 'Xoá',
        }
      : {
          title: 'Thay thế task đang chạy?',
          content: 'Bạn có chắc muốn chạy task này thay thế task đang chạy?',
          btnConfirm: 'Bắt đầu',
        };
  return (
    <div className="col-span-2 grid grid-rows-2 h-full gap-6">
      <div className="flex flex-col items-center p-4">
        <h3 className="font-semibold mb-4">Danh sách ({todoTasks.length})</h3>
        <Accordion type="single" collapsible className="w-full max-h-80">
          {todoTasks.map((task) => (
            <AccordionItem value={task.name} key={task.id}>
              <AccordionTrigger
                className={clsx({
                  'text-green-500':
                    runningTask && runningTask.task.id === task.id,
                })}
              >
                {task.name}
              </AccordionTrigger>
              <AccordionContent>
                {task.description}
                <div className="mt-2 flex justify-between">
                  {runningTask && runningTask.task.id === task.id ? (
                    <p className="text-green-500">Đang chạy...</p>
                  ) : (
                    <PlayIcon
                      className="mt-1 text-green-500 font-bold h-4 w-4 hover:cursor-pointer hover:text-green-400"
                      onClick={handleStartTask(task)}
                    />
                  )}
                  <div className="flex gap-2">
                    {/* <Pencil1Icon
                      className="mt-1 text-slate-500 font-bold h-4 w-4 hover:cursor-pointer hover:text-slate-400"
                      onClick={confirmDelete(task)}
                    /> */}
                    <TrashIcon
                      className="mt-1 text-red-500 font-bold h-4 w-4 hover:cursor-pointer hover:text-red-400"
                      onClick={handleDeleteTask(task)}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <div className="flex flex-col items-center p-4">
        <h3 className="text-blue-500 font-semibold mb-4">
          Đã hoàn thành hôm nay ({doneTasks.length})
        </h3>
        <Accordion type="single" collapsible className="w-full max-h-80">
          {doneTasks.map((task) => (
            <AccordionItem value={task.name} key={task.id}>
              <AccordionTrigger>{task.name}</AccordionTrigger>
              <AccordionContent>{task.description}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <AlertDialog open={processTaskState !== null}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle> {dlgState.title} </AlertDialogTitle>
            <AlertDialogDescription>{dlgState.content}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelTaskProcess}>
              Huỷ bỏ
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={acceptTaskProcess}
              className="bg-red-500 hover:bg-red-400"
            >
              {dlgState.btnConfirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
export default Right;
