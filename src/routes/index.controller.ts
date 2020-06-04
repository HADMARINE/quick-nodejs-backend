import { Request, Response } from 'express';
import Controller from '@lib/blueprint/Controller';
import welcome from '@src/pages/Welcome';
import moment from 'moment';

export default new (class extends Controller {
  constructor() {
    super();
    this.router.all('/', this.welcome);
    this.router.get('/info', this.apiInfo);
    this.router.get('/info/time', this.timeInfo);
  }

  private welcome = this.LegacyWrapper(async (req, res) => {
    res.send(
      welcome(
        'TS-NODE-EXPRESS-MONGO BACKEND',
        `${moment().format(
          'YYYY-MM-DD HH:mm:ss',
        )}<br/> See api info on <a href="/info"><b>GET /info</b></a>`,
      ),
    );
  });

  private apiInfo = this.Wrapper(async (req, res) => {
    const data = {
      v1: 'production',
    };
    res(200, data);
  });

  private timeInfo = this.LegacyWrapper(async (req, res) => {
    res.send(moment().format('YYYY-MM-DD HH:mm:ss'));
  });
})();
