import logger from '@lib/logger';
import welcome from '@src/pages/Welcome';
import moment from 'moment';
import packageJson from '../../package.json';
import { WrappedRequest } from '@util/ControllerUtil';
import {
  AllMapping,
  Controller,
  GetMapping,
  PostMapping,
} from '@util/RestDecorator';

interface IndexControllerInterface {
  index(): string;

  status(): string;

  info(): Record<string, any>;

  versionInfo(): string;

  timeInfo(): string;

  test(req: WrappedRequest): void;
}

@Controller
export default class IndexController implements IndexControllerInterface {
  @AllMapping()
  index(): string {
    return welcome(
      packageJson.name,
      `${moment().format(
        'YYYY-MM-DD HH:mm:ss',
      )}<br/> See api info on <a href="/info"><b>GET /info</b></a>`,
    );
  }

  @GetMapping('/status')
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
    const { obj, data } = req.verify.body({
      obj: 'array',
      data: {
        obj: 'array',
      },
    });

    logger.debug(data.obj, false);
  }

  @GetMapping('/info/time')
  timeInfo(): string {
    return moment().format('YYYY-MM-DD HH:mm:ss');
  }

  @GetMapping('/info/version')
  versionInfo(): string {
    return packageJson.version;
  }
}
