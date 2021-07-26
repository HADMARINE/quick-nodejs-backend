import socketio from 'socket.io';

export {};

declare global {
  namespace Socketio {
    type Server = socketio.Server;
    type Socket = socketio.Socket;
  }
  type ValueOf<T> = T[keyof T];
  type TypeGuard<T extends (args: any) => any> = T extends (
    args: any,
  ) => args is infer R
    ? R
    : any;
  type Nullish<T> = {
    [P in keyof T]: T[P] | null;
  };
  type PartialNullish<T> = Partial<Nullish<T>>;
  type Arrayify<T> = {
    [P in keyof T]: T[P][];
  };
  type Some = string | number | boolean | symbol | bigint | object;
}
