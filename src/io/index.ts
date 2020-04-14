import socketio from 'socket.io';

export default function (server: any) {
  const io = socketio(server);

  io.on('connection', (socket: any) => {
    socket.on('disconnect', (data: any) => {});
  });
}
