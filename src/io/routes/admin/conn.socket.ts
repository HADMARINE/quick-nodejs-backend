import SC from '@lib/blueprint/SocketController';

export default class extends SC {
  main(): void {
    console.log(this.parameters);
    this.current.emit('hello', this.parameters);
  }
}
