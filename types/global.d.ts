import socketio from 'socket.io';

export {};

declare global {
  namespace Socketio {
    type Server = socketio.Server;
    type Socket = socketio.Socket;
  }
}
