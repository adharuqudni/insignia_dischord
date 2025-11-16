import {
  isValidCronExpression,
  calculateNextExecution,
  calculateBackoffDelay,
} from '../src/utils/cronUtils';

describe('Cron Utils', () => {
  describe('isValidCronExpression', () => {
    it('should validate correct cron expressions', () => {
      expect(isValidCronExpression('* * * * *')).toBe(true); // Every minute
      expect(isValidCronExpression('0 * * * *')).toBe(true); // Every hour
      expect(isValidCronExpression('0 0 * * *')).toBe(true); // Daily at midnight
      expect(isValidCronExpression('0 12 * * *')).toBe(true); // Daily at noon
      expect(isValidCronExpression('0 0 * * 0')).toBe(true); // Weekly on Sunday
    });

    it('should reject invalid cron expressions', () => {
      expect(isValidCronExpression('invalid')).toBe(false);
      expect(isValidCronExpression('60 * * * *')).toBe(false); // Invalid minute
      expect(isValidCronExpression('* 25 * * *')).toBe(false); // Invalid hour
      expect(isValidCronExpression('')).toBe(false);
    });
  });

  describe('calculateNextExecution', () => {
    it('should return a future date for valid cron expression', () => {
      const now = new Date();
      const next = calculateNextExecution('* * * * *');
      
      expect(next).toBeInstanceOf(Date);
      expect(next!.getTime()).toBeGreaterThan(now.getTime());
    });

    it('should return null for invalid cron expression', () => {
      expect(calculateNextExecution('invalid')).toBe(null);
    });
  });

  describe('calculateBackoffDelay', () => {
    it('should calculate exponential backoff correctly', () => {
      expect(calculateBackoffDelay(0, 1000)).toBe(1000); // 1s * 2^0 = 1s
      expect(calculateBackoffDelay(1, 1000)).toBe(2000); // 1s * 2^1 = 2s
      expect(calculateBackoffDelay(2, 1000)).toBe(4000); // 1s * 2^2 = 4s
      expect(calculateBackoffDelay(3, 1000)).toBe(8000); // 1s * 2^3 = 8s
      expect(calculateBackoffDelay(4, 1000)).toBe(16000); // 1s * 2^4 = 16s
      expect(calculateBackoffDelay(5, 1000)).toBe(32000); // 1s * 2^5 = 32s
    });

    it('should cap at maximum delay of 60 seconds', () => {
      expect(calculateBackoffDelay(10, 1000)).toBe(60000); // Max 60s
      expect(calculateBackoffDelay(20, 1000)).toBe(60000); // Max 60s
    });

    it('should work with different base delays', () => {
      expect(calculateBackoffDelay(0, 500)).toBe(500);
      expect(calculateBackoffDelay(1, 500)).toBe(1000);
      expect(calculateBackoffDelay(2, 500)).toBe(2000);
    });

    it('should use default base delay of 1000ms', () => {
      expect(calculateBackoffDelay(0)).toBe(1000);
      expect(calculateBackoffDelay(1)).toBe(2000);
    });
  });
});

