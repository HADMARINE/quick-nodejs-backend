import returnError from '../lib/returnError';

export default {
  access: {
    pagenotfound(directory = '') {
      const data: any = {};
      if (directory) {
        data.directory = directory;
      }
      return returnError('Page Not Found', 404, 'PAGE_NOT_FOUND', { data });
    },
  },
  password: {
    encryption() {
      return returnError(
        'Password Encryption failed',
        500,
        'PASSWORD_ENCRYTION_FAIL',
      );
    },
  },
  authorization: {
    tokeninvalid() {
      return returnError('Token Invalid', 403, 'TOKEN_INVALID');
    },
  },
  data: {
    parameternull(col: any = '') {
      return returnError(
        `Necessary parameter${col ? ` ${col}` : ``} is not provided.`,
        400,
        'PARAMETER_NOT_PROVIDED',
      );
    },
  },
  db: {
    create(collection: string | null = null) {
      return returnError(
        `Failed to save data${
          collection ? ` of ${collection}` : ``
        } to Database.`,
        500,
        'DATABASE_SAVE_FAIL',
      );
    },
    exists(collection: string | null = null) {
      return returnError(
        `${collection ? `${collection} ` : ``}Data Already exists.`,
        409,
        `UNIQUE_DATA_CONFLICT`,
      );
    },
  },
};
