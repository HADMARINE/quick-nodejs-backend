import logger from 'clear-logger';
import welcome from '@src/pages/Welcome';
import moment from 'moment';
import packageJson from '../../package.json';
import {
  AllMapping,
  Controller,
  GetMapping,
  PostMapping,
  ReturnRawData,
  WrappedRequest,
  DataTypes,
} from 'express-quick-builder';
import { AnyVerifier } from 'express-quick-builder/dist/util/DataVerify';

@Controller
export default class IndexController {
  @AllMapping()
  @ReturnRawData()
  index(): string {
    return welcome(
      packageJson.name,
      `${moment().format(
        'YYYY-MM-DD HH:mm:ss',
      )}<br/> See api info on <a href="/info"><b>GET /info</b></a>`,
    );
  }

  @GetMapping('/status')
  @ReturnRawData()
  status(): string {
    return 'UP';
  }

  @GetMapping('/info')
  info(): Record<string, any> {
    return {
      v1: process.env.NODE_ENV,
      serverVersion: packageJson.version,
    };
  }

  @PostMapping('/test')
  test(req: WrappedRequest): void {
    logger.debug(req.body.obj, false);
    const { obj } = req.verify.body({
      // data: DataTypes.array({ valueVerifier: DataTypes.string() }),
      obj: DataTypes.array({ valueVerifier: DataTypes.number() }),
    });

    // logger.debug(data, false);
    logger.debug(obj, false);
  }

  @GetMapping('/info/time')
  @ReturnRawData()
  timeInfo(): string {
    return moment().format('YYYY-MM-DD HH:mm:ss');
  }

  @GetMapping('/info/version')
  versionInfo(): string {
    return packageJson.version;
  }
}
