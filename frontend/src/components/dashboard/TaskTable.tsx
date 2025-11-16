'use client';

import { Task } from '@/lib/api/tasks';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Play,
  Pause,
  Edit,
  Trash2,
  MoreVertical,
  Clock,
} from 'lucide-react';
import { format } from 'date-fns';

interface TaskTableProps {
  tasks: Task[];
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onToggle?: (taskId: string) => void;
  onExecute?: (taskId: string) => void;
}

export function TaskTable({
  tasks,
  onEdit,
  onDelete,
  onToggle,
  onExecute,
}: TaskTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Schedule</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Next Execution</TableHead>
            <TableHead>Last Execution</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No tasks found. Create your first task to get started.
              </TableCell>
            </TableRow>
          ) : (
            tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{task.name}</span>
                    {task.description && (
                      <span className="text-xs text-muted-foreground">
                        {task.description}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {task.schedule}
                  </code>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Badge
                      variant={
                        task.status === 'active'
                          ? 'default'
                          : task.status === 'paused'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {task.status}
                    </Badge>
                    {task.is_enabled && (
                      <Badge variant="outline" className="text-success">
                        Enabled
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {task.next_execution ? (
                    <span className="text-sm">
                      {format(new Date(task.next_execution), 'MMM d, HH:mm')}
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {task.last_execution ? (
                    <span className="text-sm">
                      {format(new Date(task.last_execution), 'MMM d, HH:mm')}
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-sm">Never</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onExecute?.(task.id)}
                        className="cursor-pointer"
                      >
                        <Play className="mr-2 h-4 w-4" />
                        Execute Now
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onToggle?.(task.id)}
                        className="cursor-pointer"
                      >
                        {task.is_enabled ? (
                          <>
                            <Pause className="mr-2 h-4 w-4" />
                            Pause Task
                          </>
                        ) : (
                          <>
                            <Clock className="mr-2 h-4 w-4" />
                            Enable Task
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onEdit?.(task)}
                        className="cursor-pointer"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete?.(task.id)}
                        className="cursor-pointer text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

