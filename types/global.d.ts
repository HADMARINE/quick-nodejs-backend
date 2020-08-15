import socketio from 'socket.io';

export {};

declare global {
  type socketServer = socketio.Server;
}
