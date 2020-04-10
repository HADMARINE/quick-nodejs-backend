import throwError from '../lib/throwError';

export default {
  access: {
    pagenotfound(directory = ''): void {
      const data: any = {};
      if (directory) {
        data.directory = directory;
      }
      throwError('Page Not Found', 404, 'PAGE_NOT_FOUND', { data });
    },
  },
  password: {
    encryption(): void {
      throwError('Password Encryption failed', 500, 'PASSWORD_ENCRYTION_FAIL');
    },
  },
  authorization: {
    tokeninvalid(): void {
      throwError('Token Invalid', 403, 'TOKEN_INVALID');
    },
  },
  data: {
    parameternull(col: any = ''): void {
      throwError(
        `Necessary parameter${col ? ` ${col}` : ``} is not provided.`,
        400,
        'PARAMETER_NOT_PROVIDED',
      );
    },
  },
  db: {
    create(collection: string | null = null): void {
      throwError(
        `Failed to save data${
          collection ? ` of ${collection}` : ``
        } to Database.`,
        500,
        'DATABASE_SAVE_FAIL',
      );
    },
  },
};
