import cron from 'node-cron';
import Auth from '@util/Auth';
import logger from '@lib/logger';

export default function (): void {
  cron.schedule('*/10 * * * *', async () => {
    logger.info(
      `Removed ${await Auth.token.remove.expired()} of expired tokens.`,
    );
  });
}
