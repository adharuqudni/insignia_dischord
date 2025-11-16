import axios from 'axios';
import { DiscordService } from '../src/services/discord.service';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Discord Service', () => {
  let discordService: DiscordService;

  beforeEach(() => {
    discordService = new DiscordService();
    jest.clearAllMocks();
  });

  describe('sendWebhook', () => {
    it('should successfully send webhook with valid payload', async () => {
      const webhookUrl = 'https://discord.com/api/webhooks/123/abc';
      const payload = {
        content: 'Test message',
        username: 'Test Bot',
      };

      const mockResponse = {
        status: 204,
        data: {},
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await discordService.sendWebhook(webhookUrl, payload);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        webhookUrl,
        payload,
        expect.objectContaining({
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000,
        })
      );
      expect(result.status).toBe(204);
    });

    it('should throw error if webhook fails', async () => {
      const webhookUrl = 'https://discord.com/api/webhooks/123/abc';
      const payload = { content: 'Test' };

      const mockError = new Error('Network error');
      mockedAxios.post.mockRejectedValue(mockError);

      await expect(
        discordService.sendWebhook(webhookUrl, payload)
      ).rejects.toThrow('Network error');
    });

    it('should send webhook with embeds', async () => {
      const webhookUrl = 'https://discord.com/api/webhooks/123/abc';
      const payload = {
        username: 'Task Bot',
        embeds: [
          {
            title: 'Task Completed',
            description: 'Task executed successfully',
            color: 3066993,
          },
        ],
      };

      mockedAxios.post.mockResolvedValue({ status: 204, data: {} });

      await discordService.sendWebhook(webhookUrl, payload);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        webhookUrl,
        payload,
        expect.any(Object)
      );
    });
  });

  describe('validatePayload', () => {
    it('should validate payload with content', () => {
      const payload = { content: 'Test message' };
      expect(discordService.validatePayload(payload)).toBe(true);
    });

    it('should validate payload with embeds', () => {
      const payload = {
        embeds: [{ title: 'Test', description: 'Test embed' }],
      };
      expect(discordService.validatePayload(payload)).toBe(true);
    });

    it('should validate payload with both content and embeds', () => {
      const payload = {
        content: 'Test',
        embeds: [{ title: 'Test' }],
      };
      expect(discordService.validatePayload(payload)).toBe(true);
    });

    it('should reject null payload', () => {
      expect(discordService.validatePayload(null)).toBe(false);
    });

    it('should reject payload without content or embeds', () => {
      const payload = { username: 'Test Bot' };
      expect(discordService.validatePayload(payload)).toBe(false);
    });

    it('should reject payload with empty embeds array', () => {
      const payload = { embeds: [] };
      expect(discordService.validatePayload(payload)).toBe(false);
    });
  });
});

