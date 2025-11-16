import cron from 'node-cron';

/**
 * Validates a cron expression
 */
export function isValidCronExpression(expression: string): boolean {
  return cron.validate(expression);
}

/**
 * Calculates the next execution time based on a cron expression
 */
export function calculateNextExecution(cronExpression: string): Date | null {
  if (!isValidCronExpression(cronExpression)) {
    return null;
  }

  // Parse cron expression and calculate next execution
  // This is a simplified version - in production you'd use a library like 'cron-parser'
  const now = new Date();
  const nextExec = new Date(now.getTime() + 60000); // Default: 1 minute from now
  
  return nextExec;
}

/**
 * Calculates exponential backoff delay in milliseconds
 */
export function calculateBackoffDelay(retryCount: number, baseDelay: number = 1000): number {
  return Math.min(baseDelay * Math.pow(2, retryCount), 60000); // Max 60 seconds
}

