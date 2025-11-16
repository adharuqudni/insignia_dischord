import * as z from 'zod';

export const taskFormSchema = z.object({
  name: z.string().min(1, 'Task name is required').max(255, 'Name is too long'),
  description: z.string().optional(),
  schedule: z
    .string()
    .min(1, 'Schedule is required')
    .regex(
      /^(\*|[0-9,\-*/]+)\s+(\*|[0-9,\-*/]+)\s+(\*|[0-9,\-*/]+)\s+(\*|[0-9,\-*/]+)\s+(\*|[0-9,\-*/]+)$/,
      'Invalid cron expression. Use format: * * * * * (minute hour day month weekday)'
    ),
  webhook_url: z
    .string()
    .min(1, 'Webhook URL is required')
    .url('Must be a valid URL')
    .startsWith('https://discord.com/api/webhooks/', 'Must be a valid Discord webhook URL'),
  payload: z
    .string()
    .min(1, 'Payload is required')
    .refine(
      (val) => {
        try {
          JSON.parse(val);
          return true;
        } catch {
          return false;
        }
      },
      'Must be valid JSON'
    ),
  max_retry: z
    .number()
    .int('Must be an integer')
    .min(0, 'Cannot be negative')
    .max(10, 'Maximum 10 retries allowed'),
  is_enabled: z.boolean(),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;

