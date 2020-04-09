import throwError from '../lib/throwError';

export default {
  PageNotFound(directory = ''): void {
    const data: any = {};
    if (directory) {
      data.directory = directory;
    }
    throwError('Page Not Found', 404, 'PAGE_NOT_FOUND', { data });
  },
};
