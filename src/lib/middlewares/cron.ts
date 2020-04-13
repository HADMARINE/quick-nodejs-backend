import cron from 'node-cron';
import Authorization from '@util/Authorization';
import logger from '@lib/logger';
'@lib/logger';

export default function (): void {
  cron.schedule('*/10 * * * *', async () => {
    logger.debug(
      `Removed ${await Authorization.token.remove.expired()} of expired tokens.`,
      false,
    );
  });
}
