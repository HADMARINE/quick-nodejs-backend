import socketio from 'socket.io';
import http from 'http';
import getEvents from '@lib/startup/getSocketEvents';
import logger from 'clear-logger';

export default function (server: http.Server): void {
  const events = getEvents();

  for (const eventDir of Object.keys(events)) {
    const io = new socketio.Server(server, {
      cors: {
        origin:
          process.env.REQUEST_URI === '*'
            ? undefined
            : `${process.env.REQUEST_URI}`,
      },
      path: `/socket/${eventDir === 'index' ? '' : eventDir}`,
    });

    const eventList = events[eventDir];
    io.on('connection', (socket: Socketio.Socket) => {
      logger.debug(`Socket ${socket.id} connected!`, false);
      Object.keys(eventList.controlled).forEach((key) => {
        socket.on(key, (...data: any[]) => {
          const guidedSocketClass = eventList.controlled[key];
          try {
            new guidedSocketClass(io, socket, data).main();
          } catch (e) {
            logger.warn(
              `Controlled socket class [${key}] has error, ignoring...`,
            );
            logger.debug(e);
          }
        });
      });
      Object.keys(eventList.raw).forEach((key) => {
        const rawSocketFunction = eventList.raw[key];
        try {
          rawSocketFunction(io, socket);
        } catch (e) {
          logger.warn(`Raw socket function [${key}] has error, ignoring...`);
          logger.debug(e);
        }
      });
    });
  }
}
