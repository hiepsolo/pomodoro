import React, { useContext } from 'react';
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
import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../store/App';

const formSchema = z.object({
  notionKey: z.string().min(1, {
    message: 'Nhập vào Notion API key',
  }),
  notionWorkspace: z.string().min(1, {
    message: 'Nhập vào Notion workspace',
  }),
});

const Setup = () => {
  const navigate = useNavigate();
  const { setConfig } = useContext(AppContext);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notionKey: '',
      notionWorkspace: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setConfig({
      notionKey: values.notionKey,
      notionWorkspace: values.notionWorkspace,
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
