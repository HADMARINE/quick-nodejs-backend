import packageSettings from '@src/../package.json';
import {
  AllMapping,
  Controller,
  SetSuccessMessage,
} from 'express-quick-builder';

@Controller
export default class IndexController {
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
