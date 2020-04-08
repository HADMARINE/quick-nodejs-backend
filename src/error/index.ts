import throwError from '../lib/throwError';

export default {
  PageNotFound(directory = ''): void {
    const errorMessage = 'Page Not found.';
    const data: any = {};
    if (directory) {
      data.directory = directory;
    }
    throwError(errorMessage, 404, 'PAGE_NOT_FOUND', { data });
  },
};
