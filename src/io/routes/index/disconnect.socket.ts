import SC from '@lib/blueprint/SocketController';
import logger from '@lib/logger';

export default class extends SC {
  main() {
    logger.info(`${this.current.id} has been disconnected!`);
  }
}
