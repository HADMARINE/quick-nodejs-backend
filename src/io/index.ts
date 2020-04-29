import socketio from 'socket.io';
import http from 'http';

export default function (server: http.Server) {
  const io = socketio(server, {
    origins: `${process.env.REQUEST_URI}`,
  });
  io.on('connection', (socket: socketio.Server) => {
    actions(socket);
  });
}

function actions(socket: socketio.Server) {
  socket.on('hello', (data: any) => {
    socket.emit('world', 'WORLD!');
    return;
  });

  socket.on('disconnect', (data: any) => {
    console.log('disconnected');
  });
}
