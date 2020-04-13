import cron from 'node-cron';
import Authorization from '@util/Authorization';
import { debugLogger } from '@lib/logger';

export default function (): void {
  cron.schedule('*/10 * * * *', async () => {
    debugLogger(
      `Removed ${await Authorization.token.remove.expired()} of expired tokens.`,
      false,
    );
  });
}
