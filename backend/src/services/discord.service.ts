import axios, { AxiosResponse } from 'axios';

export class DiscordService {
  /**
   * Sends a message to a Discord webhook
   */
  async sendWebhook(webhookUrl: string, payload: any): Promise<AxiosResponse> {
    try {
      const response = await axios.post(webhookUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 second timeout
      });
      
      return response;
    } catch (error: any) {
      console.error('Discord webhook error:', error.message);
      throw error;
    }
  }

  /**
   * Validates Discord payload structure
   */
  validatePayload(payload: any): boolean {
    // Basic validation - Discord requires at least content or embeds
    if (!payload) return false;
    
    if (!payload.content && (!payload.embeds || payload.embeds.length === 0)) {
      return false;
    }

    return true;
  }
}

