import packageSettings from '@src/../package.json';
import { AllMapping, Controller, SetSuccessMessage } from '@util/RestDecorator';

interface IndexControllerInterface {
  index(): Record<string, any>;
}

@Controller
export default class IndexController implements IndexControllerInterface {
  @AllMapping()
  @SetSuccessMessage('Welcome to V1 API')
  index(): Record<string, any> {
    return {
      status: 'alive',
      mode: process.env.NODE_ENV || 'development',
      version: packageSettings.version,
    };
  }
}
