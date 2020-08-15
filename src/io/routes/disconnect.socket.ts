import SC from '@lib/blueprint/SocketController';

export default class extends SC {
  main() {
    console.log(`${this.current.id} has been disconnected!`);
  }
}
