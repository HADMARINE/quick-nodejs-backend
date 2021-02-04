import app from '../index';

async function createServer(): Promise<typeof app> {
  return (await app).listen(63000);
}

async function closeServer(
  done: any = function (): void {
    return;
  },
): Promise<void> {
  (await app).close();
  done();
}

export default {
  server: {
    create: createServer,
    close: closeServer,
  },
};
