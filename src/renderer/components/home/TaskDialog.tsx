import React, { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { nanoid } from 'nanoid';
import { useAppStore } from '../../store/app';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';

const formSchema = z.object({
  name: z.string().min(1, {
    message: 'Hừm, đừng lười, nhập vào tên việc đi ><',
  }),
  description: z.string(),
});

type Props = {
  taskId?: string;
  isOpen: boolean;
  close: () => void;
};

const TaskDialog = ({ taskId, close, isOpen }: Props) => {
  const { selectedTask, getTask, addTask, updateTask } = useAppStore(
    useShallow((state) => ({
      selectedTask: state.selectedTask,
      getTask: state.getTask,
      addTask: state.addTask,
      updateTask: state.updateTask,
    })),
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: selectedTask ? selectedTask.name : '',
      description: selectedTask ? selectedTask.description : '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (taskId && selectedTask) {
      updateTask({ id: taskId, ...values });
    } else {
      addTask({
        id: nanoid(),
        ...values,
        status: 'todo',
      });
    }
    close();
  };
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      close();
    }
  };

  useEffect(() => {
    if (taskId && isOpen) {
      getTask(taskId);
    }
  }, [taskId, getTask, isOpen]);

  useEffect(() => {
    if (isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  useEffect(() => {
    if (selectedTask) {
      form.setValue('name', selectedTask.name);
      form.setValue('description', selectedTask.description);
    }
  }, [selectedTask, form]);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {selectedTask ? 'Cập nhật task' : 'Tạo việc mới'}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên</FormLabel>
                    <FormControl>
                      <Input placeholder="Tên việc nào :)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notion workspace</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Mô tả (Ko cần làm đâu)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Lưu
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
