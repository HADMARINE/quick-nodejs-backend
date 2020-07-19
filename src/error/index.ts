import returnError from '../lib/returnError';

export default {
  custom: (message: string, status: number, code: string): Error =>
    returnError(message, status, code),
  test(): Error {
    return returnError(null, 418, null);
  },
  action: {
    unsafe: (): Error =>
      returnError(
        "Handling unsafe actions without 'unsafe' props is not allowed. This error is usually occurs when the action removes all datas of db or stops operation of server.",
        403,
        'UNSAFE_NOT_HANDLED',
      ),
  },
  access: {
    pageNotFound(directory = ''): Error {
      const data: any = {};
      if (directory) {
        data.directory = directory;
      }
      return returnError(
        `Page Not Found. REQURI:${directory}`,
        404,
        'PAGE_NOT_FOUND',
        { data },
      );
    },
    tooManyRequests: (): Error =>
      returnError('Too many requests', 429, 'TOO_MANY_REQUESTS'),
  },
  password: {
    encryption: (): Error =>
      returnError('Password Encryption failed', 500, 'PASSWORD_ENCRYTION_FAIL'),
  },
  auth: {
    tokenInvalid: (): Error =>
      returnError('Token Invalid', 403, 'TOKEN_INVALID'),
    tokenExpired: (): Error =>
      returnError('Token Expired', 403, 'TOKEN_EXPIRED'),
    tokenRenewNeeded: (): Error =>
      returnError('Token renew needed', 403, 'TOKEN_RENEW_NEEDED'),
    fail: (): Error => returnError('Login Failed', 403, 'LOGIN_FAIL'),
    access: {
      lackOfAuthority: (): Error =>
        returnError(
          'Authority is not enough to access',
          403,
          'LACK_OF_AUTHORITY',
        ),
    },
  },
  data: {
    parameterNull: (col: any = ''): Error =>
      returnError(
        `Necessary parameter${col ? ` ${col}` : ``} is not provided.`,
        400,
        'PARAMETER_NOT_PROVIDED',
      ),
    parameterInvalid: (col: any = ''): Error =>
      returnError(
        `Parameter${col ? ` ${col}` : ``} is invalid.`,
        400,
        'PARAMETER_INVALID',
      ),
  },
  db: {
    create(collection: string | null = null): Error {
      return returnError(
        `Failed to save data${
          collection ? ` of ${collection}` : ``
        } to Database.`,
        500,
        'DATABASE_SAVE_FAIL',
      );
    },
    exists(collection: string | null = null): Error {
      return returnError(
        `${collection ? `${collection} ` : ``}Data Already exists.`,
        409,
        `UNIQUE_DATA_CONFLICT`,
      );
    },
    notfound(): Error {
      return returnError(`Data not found.`, 404, `DATA_NOT_FOUND`);
    },
    error: (): Error =>
      returnError(
        `Failed to resolve database process`,
        500,
        `DATABASE_PROCESS_FAIL`,
      ),
  },
  aws: {
    SES: (): Error =>
      returnError(`Sending email failed.`, 500, `EMAIL_SEND_FAIL`),
    S3: (message = `Uploading file failed.`): Error =>
      returnError(message, 500, `FILE_PROCESS_FAIL`),
  },
};
