import app from '../index';

async function createServer(): Promise<any> {
  return (await app).listen(80);
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
    create: createServer(),
    close: closeServer,
  },
};
