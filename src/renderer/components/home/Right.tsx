import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@components/ui/accordion';
import { PlayIcon, TrashIcon } from '@radix-ui/react-icons';
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

type Props = {};

const Right = (props: Props) => {
  const [deletedTask, setDeletedTask] = useState<Task | null>(null);
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
      ? tasks.filter((task) => task.status === 'todo')
      : [];
  const doneTasks =
    tasks && tasks.length > 0
      ? tasks.filter((task) => task.status === 'done')
      : [];
  const confirmDelete = (task: Task) => () => {
    setDeletedTask(task);
  };
  const acceptTaskDeleting = () => {
    setDeletedTask(null);
    setTasks(tasks.filter((t) => t.name !== deletedTask?.name));
  };
  const cancelTaskDeleting = () => {
    setDeletedTask(null);
  };
  const startTask = (task: Task) => () => {
    // TODO start task
  };

  return (
    <div className="col-span-2 grid grid-rows-2 h-full gap-6">
      <div className="flex flex-col items-center p-4">
        <h3 className="font-semibold mb-4">Danh sách (3)</h3>
        <Accordion type="single" collapsible className="w-full max-h-80">
          {todoTasks.map((task) => (
            <AccordionItem value={task.name} key={task.name}>
              <AccordionTrigger>{task.name}</AccordionTrigger>
              <AccordionContent>
                {task.description}
                <div className="flex justify-between">
                  <PlayIcon
                    className="mt-1 text-green-500 font-bold h-4 w-4 hover:cursor-pointer hover:text-green-400"
                    onClick={startTask(task)}
                  />
                  <div className="flex gap-2">
                    {/* <Pencil1Icon
                      className="mt-1 text-slate-500 font-bold h-4 w-4 hover:cursor-pointer hover:text-slate-400"
                      onClick={confirmDelete(task)}
                    /> */}
                    <TrashIcon
                      className="mt-1 text-red-500 font-bold h-4 w-4 hover:cursor-pointer hover:text-red-400"
                      onClick={confirmDelete(task)}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <div className="flex flex-col items-center p-4">
        <h3 className="text-blue-500 font-semibold mb-4">Đã hoàn thành (1)</h3>
        <Accordion type="single" collapsible className="w-full max-h-80">
          {doneTasks.map((task) => (
            <AccordionItem value={task.name} key={task.name}>
              <AccordionTrigger>{task.name}</AccordionTrigger>
              <AccordionContent>{task.description}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <AlertDialog open={deletedTask !== null}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle> Xoá? </AlertDialogTitle>
            <AlertDialogDescription>Bạn có chắc ko?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelTaskDeleting}>
              Huỷ bỏ
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={acceptTaskDeleting}
              className="bg-red-500 hover:bg-red-400"
            >
              Xoá
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
export default Right;
