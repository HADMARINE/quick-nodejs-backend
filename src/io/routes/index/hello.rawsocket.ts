export default function (io: Socketio.Server, socket: Socketio.Socket): void {
  socket.on('conn-2', (...data: any[]) => {
    console.log(data);
    // const result = data[1]();
    // console.log(result);
    socket.emit('hello', 'world');
  });
}
