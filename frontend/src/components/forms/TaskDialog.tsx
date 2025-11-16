'use client';

import { Task } from '@/lib/api/tasks';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TaskForm } from './TaskForm';
import { TaskFormValues } from '@/lib/validations/task';

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task;
  onSubmit: (values: TaskFormValues) => Promise<void>;
}

export function TaskDialog({ open, onOpenChange, task, onSubmit }: TaskDialogProps) {
  const handleSubmit = async (values: TaskFormValues) => {
    await onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Create New Task'}</DialogTitle>
          <DialogDescription>
            {task
              ? 'Update the task details below. Changes will take effect immediately.'
              : 'Configure a new scheduled task to send Discord webhook messages.'}
          </DialogDescription>
        </DialogHeader>
        <TaskForm task={task} onSubmit={handleSubmit} onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

