import { ErrorBuilder } from 'express-quick-builder';
import { codeData } from '@lib/httpCode';

export default {
  custom: (
    message: string,
    status: keyof typeof codeData,
    code: string,
  ): Error => ErrorBuilder(message, status, code),
  test: (): Error => ErrorBuilder(null, 418, null),
  action: {
    unsafe: (): Error =>
      ErrorBuilder(
        "Handling unsafe actions without 'unsafe' props is not allowed. This error is usually occurs when the action removes all datas of db or stops operation of server.",
        403,
        'UNSAFE_NOT_HANDLED',
      ),
  },
  connection: {
    pageNotFound(directory = ''): Error {
      const data: any = {};
      if (directory) {
        data.directory = directory;
      }
      return ErrorBuilder(
        `Page Not Found. REQURI:${directory}`,
        404,
        'PAGE_NOT_FOUND',
        { data },
      );
    },
    tooManyRequests: (): Error =>
      ErrorBuilder('Too many requests', 429, 'TOO_MANY_REQUESTS'),
  },
  password: {
    encryption: (): Error =>
      ErrorBuilder(
        'Password Encryption failed',
        500,
        'PASSWORD_ENCRYTION_FAIL',
      ),
  },
  auth: {
    tokenInvalid: (): Error =>
      ErrorBuilder('Token Invalid', 403, 'TOKEN_INVALID'),
    tokenExpired: (): Error =>
      ErrorBuilder('Token Expired', 403, 'TOKEN_EXPIRED'),
    tokenRenewNeeded: (): Error =>
      ErrorBuilder('Token renew needed', 403, 'TOKEN_RENEW_NEEDED'),
    fail: (): Error => ErrorBuilder('Login Failed', 403, 'LOGIN_FAIL'),
    access: {
      lackOfAuthority: (): Error =>
        ErrorBuilder(
          'Authority is not enough to access',
          403,
          'LACK_OF_AUTHORITY',
        ),
    },
  },
  data: {
    parameterNull: (col: any = ''): Error =>
      ErrorBuilder(
        `Necessary parameter${col ? ` ${col}` : ``} is not provided.`,
        400,
        'PARAMETER_NOT_PROVIDED',
      ),
    parameterInvalid: (col: any = ''): Error =>
      ErrorBuilder(
        `Parameter${col ? ` ${col}` : ``} is invalid.`,
        400,
        'PARAMETER_INVALID',
      ),
    dataNull: (col: any = ''): Error =>
      ErrorBuilder(`Data${col ? ` ${col}` : ``} is null`, 500, 'DATA_NULL'),
  },
  db: {
    create(collection: string | null = null): Error {
      return ErrorBuilder(
        `Failed to save data${
          collection ? ` of ${collection}` : ``
        } to Database.`,
        500,
        'DATABASE_SAVE_FAIL',
      );
    },
    exists(collection: string | null = null): Error {
      return ErrorBuilder(
        `${collection ? `${collection} ` : ``}Data Already exists.`,
        409,
        `UNIQUE_DATA_CONFLICT`,
      );
    },
    notfound(): Error {
      return ErrorBuilder(`Data not found.`, 404, `DATA_NOT_FOUND`);
    },
    partial: (action: string, successCount: number): Error =>
      ErrorBuilder(
        `Partial success of ${action}. Only ${successCount} of document succeeded.`,
        500,
        `PARTIAL_SUCCESS`,
      ),
    error: (): Error =>
      ErrorBuilder(
        `Failed to resolve database process`,
        500,
        `DATABASE_PROCESS_FAIL`,
      ),
  },
  aws: {
    SES: (): Error =>
      ErrorBuilder(`Sending email failed.`, 500, `EMAIL_SEND_FAIL`),
    S3: (message = `Uploading file failed.`): Error =>
      ErrorBuilder(message, 500, `FILE_PROCESS_FAIL`),
  },
};
