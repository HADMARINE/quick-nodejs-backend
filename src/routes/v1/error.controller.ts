import errorMessage from '@src/settings/errorMessage';
import {
  Controller,
  DataTypes,
  GetMapping,
  WrappedRequest,
} from 'express-quick-builder';

@Controller
export default class ErrorController {
  @GetMapping(':locale/:errorcode')
  getError(req: WrappedRequest): string {
    const { locale, errorcode } = req.verify.params({
      locale: DataTypes.string(),
      errorcode: DataTypes.string(),
    });

    return errorMessage(locale.toLowerCase())(errorcode);
  }
}
