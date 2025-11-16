'use client';

import { TaskLog } from '@/lib/api/tasks';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Eye } from 'lucide-react';
import { format } from 'date-fns';

interface LogsTableProps {
  logs: TaskLog[];
}

export function LogsTable({ logs }: LogsTableProps) {
  const getStatusVariant = (status: TaskLog['status']) => {
    switch (status) {
      case 'success':
        return 'default';
      case 'failed':
        return 'destructive';
      case 'retrying':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Task ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Retry Count</TableHead>
            <TableHead>Response Status</TableHead>
            <TableHead>Execution Time</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No logs found.
              </TableCell>
            </TableRow>
          ) : (
            logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {log.task_id.slice(0, 8)}
                  </code>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(log.status)}>{log.status}</Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {log.retry_count > 0 ? `${log.retry_count}` : '-'}
                  </span>
                </TableCell>
                <TableCell>
                  {log.response_status ? (
                    <Badge
                      variant={log.response_status >= 200 && log.response_status < 300 ? 'default' : 'destructive'}
                    >
                      {log.response_status}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {format(new Date(log.execution_time), 'MMM d, yyyy HH:mm:ss')}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Execution Log Details</DialogTitle>
                        <DialogDescription>
                          Log ID: {log.id}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Task ID</label>
                          <p className="text-sm text-muted-foreground font-mono">
                            {log.task_id}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Status</label>
                          <div className="mt-1">
                            <Badge variant={getStatusVariant(log.status)}>
                              {log.status}
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Execution Time</label>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(log.execution_time), 'PPpp')}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Retry Count</label>
                          <p className="text-sm text-muted-foreground">
                            {log.retry_count}
                          </p>
                        </div>
                        {log.response_status && (
                          <div>
                            <label className="text-sm font-medium">Response Status</label>
                            <p className="text-sm text-muted-foreground">
                              {log.response_status}
                            </p>
                          </div>
                        )}
                        {log.response_body && (
                          <div>
                            <label className="text-sm font-medium">Response Body</label>
                            <pre className="mt-1 text-xs bg-muted p-3 rounded overflow-x-auto">
                              {log.response_body}
                            </pre>
                          </div>
                        )}
                        {log.error_message && (
                          <div>
                            <label className="text-sm font-medium text-destructive">
                              Error Message
                            </label>
                            <pre className="mt-1 text-xs bg-destructive/10 text-destructive p-3 rounded overflow-x-auto">
                              {log.error_message}
                            </pre>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

