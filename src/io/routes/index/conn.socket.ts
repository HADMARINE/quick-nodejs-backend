import SC from '@lib/blueprint/SocketController';

export default class extends SC {
  main() {
    console.log(this.parameters);
    const a = this.parameters[1];
    console.log(a);
    this.current.emit('hello', this.parameters);
  }
}
