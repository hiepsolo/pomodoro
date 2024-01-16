import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/renderer/components/ui/form';
import { useShallow } from 'zustand/react/shallow';
import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/app';

const formSchema = z.object({
  notionKey: z.string().min(1, {
    message: 'Nhập vào Notion API key',
  }),
  notionWorkspace: z.string().min(1, {
    message: 'Nhập vào Notion workspace',
  }),
  timeLimit: z.number().min(1, {
    message: 'Nhập vào time cho mỗi task',
  }),
});

const DEFAULT_TIME_LIMIT = 25; // Minutes

const Setup = () => {
  const navigate = useNavigate();
  const { config, setConfig } = useAppStore(
    useShallow((state) => ({
      config: state.config,
      setConfig: state.setConfig,
    })),
  );
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notionKey: config.notionKey,
      notionWorkspace: config.notionWorkspace,
      timeLimit: DEFAULT_TIME_LIMIT,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setConfig({
      notionKey: values.notionKey,
      notionWorkspace: values.notionWorkspace,
      timeLimit: values.timeLimit,
    });
    navigate('/home');
  };
  return (
    <div className="flex flex-col justify-center items-center p-6 h-screen">
      <h3 className="text-4xl mb-8">Cài đặt</h3>
      <div className="w-full max-w-96">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="notionKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notion API Key</FormLabel>
                  <FormControl>
                    <Input placeholder="API key của bạn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notionWorkspace"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notion workspace</FormLabel>
                  <FormControl>
                    <Input placeholder="Workspace của bạn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="timeLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thời gian mỗi pomodoro (min)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Số phút mỗi pomorodo"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
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
    </div>
  );
};

export default Setup;
