'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskFormSchema, TaskFormValues } from '@/lib/validations/task';
import { Task } from '@/lib/api/tasks';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface TaskFormProps {
  task?: Task;
  onSubmit: (values: TaskFormValues) => Promise<void>;
  onCancel?: () => void;
}

const defaultPayload = JSON.stringify(
  {
    content: 'Hello from Task Scheduler!',
    embeds: [
      {
        title: 'Scheduled Message',
        description: 'This is an automated message',
        color: 5814783,
      },
    ],
  },
  null,
  2
);

export function TaskForm({ task, onSubmit, onCancel }: TaskFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      name: task?.name || '',
      description: task?.description || '',
      schedule: task?.schedule || '0 * * * *',
      webhook_url: task?.webhook_url || '',
      payload: task?.payload ? JSON.stringify(task.payload, null, 2) : defaultPayload,
      max_retry: task?.max_retry || 3,
      is_enabled: task?.is_enabled ?? true,
    },
  });

  const handleSubmit = async (values: TaskFormValues) => {
    try {
      setIsSubmitting(true);
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Name *</FormLabel>
              <FormControl>
                <Input placeholder="Daily Discord Update" {...field} />
              </FormControl>
              <FormDescription>A descriptive name for your task</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Sends daily updates to the team channel" {...field} />
              </FormControl>
              <FormDescription>Optional description of what this task does</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="schedule"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cron Schedule *</FormLabel>
              <FormControl>
                <Input placeholder="0 * * * *" {...field} />
              </FormControl>
              <FormDescription>
                Cron expression (minute hour day month weekday). Examples:
                <br />
                <code className="text-xs">0 * * * *</code> - Every hour
                <br />
                <code className="text-xs">*/15 * * * *</code> - Every 15 minutes
                <br />
                <code className="text-xs">0 9 * * 1-5</code> - 9 AM on weekdays
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="webhook_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discord Webhook URL *</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="https://discord.com/api/webhooks/..."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Your Discord webhook URL (starts with https://discord.com/api/webhooks/)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="payload"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payload (JSON) *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={defaultPayload}
                  className="font-mono text-sm min-h-[200px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Discord webhook payload in JSON format. Must include at least "content" or "embeds".
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="max_retry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max Retry Attempts</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  max={10}
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                />
              </FormControl>
              <FormDescription>Number of retry attempts if webhook fails (0-10)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-end gap-3 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {task ? 'Update Task' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

