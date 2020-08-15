import C from '@lib/blueprint/Controller';
import packageSettings from '@src/../package.json';

export default class extends C {
  constructor() {
    super();
    this.router.all('/', this.getIndex);
  }

  private getIndex = C.RawWrapper(async (req, res) => {
    C.Response(res)(
      200,
      {
        status: 'alive',
        mode: process.env.NODE_ENV || 'development',
        version: packageSettings.version,
      },
      { message: 'Welcome to V1 API' },
    );
  });
}
