import throwError from '../lib/throwError';

export const PageNotFound = (directory: string = '') => {
  let errorMessage = 'Page Not found.';
  if (directory) {
  }
  throwError(errorMessage, 404, 'PAGE_NOT_FOUND');
};
