import cron from 'node-cron';
import Auth from '@util/Auth';
import logger from 'clear-logger';

export default function (): void {
  if (process.env.NODE_ENV === 'test') return;

  cron.schedule('*/10 * * * *', async () => {
    logger.info(
      `Removed ${await Auth.token.remove.expired()} of expired tokens.`,
    );
  });
}
