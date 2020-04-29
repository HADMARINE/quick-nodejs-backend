import app from '../index';

async function createServer() {
  return (await app).listen(80);
}

async function closeServer(done: any = function () {}) {
  (await app).close();
  done();
}

export default {
  server: {
    create: createServer(),
    close: closeServer,
  },
};
