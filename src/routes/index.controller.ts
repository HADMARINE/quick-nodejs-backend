import C from '@lib/blueprint/Controller';
import logger from '@lib/logger';
import welcome from '@src/pages/Welcome';
import moment from 'moment';
import packageJson from '../../package.json';

export default class extends C {
  constructor() {
    super();
    this.router.all('/', this.welcome);
    this.router.get('/status', this.status);
    this.router.get('/info', this.apiInfo);
    this.router.get('/info/version', this.version);
    this.router.get('/info/time', this.timeInfo);
    this.router.post('/test', this.postTest);
  }

  private postTest = C.Wrapper(async (req, res) => {
    const { obj } = req.verify.body({
      obj: 'array',
    });

    logger.debug(obj, req.body.obj);

    res.strict(200);
  });

  private welcome = C.RawWrapper(async (req, res) => {
    res.send(
      welcome(
        packageJson.name,
        `${moment().format(
          'YYYY-MM-DD HH:mm:ss',
        )}<br/> See api info on <a href="/info"><b>GET /info</b></a>`,
      ),
    );
  });

  private status = C.RawWrapper(async (req, res) => {
    res.send('UP');
  });

  private version = C.RawWrapper(async (req, res) => {
    res.send(packageJson.version);
  });

  private apiInfo = C.Wrapper(async (req, res) => {
    const data = {
      v1: process.env.NODE_ENV,
      serverVersion: packageJson.version,
    };

    res.strict(200, data);
  });

  private timeInfo = C.RawWrapper(async (req, res) => {
    res.send(moment().format('YYYY-MM-DD HH:mm:ss'));
  });
}
