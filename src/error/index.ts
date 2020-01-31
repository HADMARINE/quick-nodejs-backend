import throwError from '../lib/throwError';

export default {
  PageNotFound(directory: string = '') {
    let errorMessage = 'Page Not found.';
    if (directory) {
      errorMessage += ` Request Directory : ${directory}`;
    }
    throwError(errorMessage, 404, 'PAGE_NOT_FOUND');
  }
};
