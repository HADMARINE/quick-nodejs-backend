import error from '@error/ErrorDictionary';
import Assets from '@util/Assets';
import Auth from '@util/Auth';
import models from '@models/index';
import Aws from '@util/Aws';

export default class SC {
  constructor(
    global: Socketio.Server,
    current: Socketio.Socket,
    parameters: any[],
  ) {
    this.global = global;
    this.current = current;
    this.parameters = parameters;
  }

  protected main(): void {
    return;
  }

  protected global: Socketio.Server;
  protected current: Socketio.Socket;
  protected parameters: any[];

  static readonly error = error;
  static readonly assets = Assets;
  static readonly auth = Auth;
  static readonly models = models;
  static readonly aws = Aws;
}
