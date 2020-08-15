export default function (io: Socketio.Server, socket: Socketio.Socket) {
  socket.on('conn-2', (...data: any[]) => {
    console.log(data);
    socket.emit('hello', 'world');
  });
}
