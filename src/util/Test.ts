import { Root } from '../index';
import http from 'http';
import ServerBuilder from 'express-quick-builder';

let rootInstance: ReturnType<typeof ServerBuilder> | undefined;

function createServer(): http.Server {
  rootInstance = Root(63000);
  return rootInstance.server;
}

async function closeServer(
  done: any = function (): void {
    return;
  },
): Promise<void> {
  if (!rootInstance) throw new Error('Root instance is not initialized!');
  rootInstance.server.close();
  rootInstance = undefined;
  done();
}

export default {
  server: {
    create: createServer,
    close: closeServer,
    instance: rootInstance,
  },
};
