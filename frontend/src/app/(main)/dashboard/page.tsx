'use client';

import { useEffect, useState } from 'react';
import { taskApi, DashboardStats } from '@/lib/api/tasks';
import { StatCard } from '@/components/dashboard/StatCard';
import {
  CheckCircle,
  Clock,
  XCircle,
  ListTodo,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await taskApi.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Tasks"
          value={stats?.total_tasks || 0}
          icon={ListTodo}
          description="All registered tasks"
        />
        <StatCard
          title="Active Tasks"
          value={stats?.active_tasks || 0}
          icon={Clock}
          description="Currently enabled"
        />
        <StatCard
          title="Success Rate"
          value={`${stats?.success_rate || 0}%`}
          icon={TrendingUp}
          description="Last 24 hours"
        />
        <StatCard
          title="Failed (24h)"
          value={stats?.failed_executions_24h || 0}
          icon={XCircle}
          description="Failed executions"
        />
      </div>

      {/* Recent Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Executions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats?.recent_logs && stats.recent_logs.length > 0 ? (
              stats.recent_logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between border-b pb-3 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        log.status === 'success'
                          ? 'default'
                          : log.status === 'failed'
                          ? 'destructive'
                          : 'secondary'
                      }
                    >
                      {log.status}
                    </Badge>
                    <span className="text-sm">Task #{log.task_id.slice(0, 8)}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(log.execution_time).toLocaleString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No recent executions</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

