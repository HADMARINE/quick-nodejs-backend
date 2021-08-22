const translateDict: Record<string, any> = {
  UNSAFE_NOT_HANDLED:
    'Unsafe method called, but all safety sequence are not released. Check that you provided UNSAFE parameter.',
  PAGE_NOT_FOUND: 'Cannot find page you requested.',
  TOO_MANY_REQUESTS:
    'Too many requests were recieved in short duration. Try again later.',
  PASSWORD_ENCRYPTION_FAIL:
    'Password encryption failed. Please retry or ask to server admin.',
  TOKEN_INVALID: 'Auth token is invalid. Must relogin.',
  TOKEN_EXPIRED: 'Auth token has been expired. Must relogin.',
  TOKEN_RENEW_NEEDED:
    'Access token must be renewed by requesting to auth server with refresh token',
  LOGIN_FAIL: 'Login failed.',
  LACK_OF_AUTHORITY:
    'We cannot process your request because of your lack of authority.',
  PARAMETER_NOT_PROVIDED:
    'Necessary parameter not provided to process your request.',
  PARAMETER_INVALID: 'Parameter is invalid.',
  DATA_NULL: 'Data is null.',
  DATABASE_SAVE_FAIL: 'Database returned error while saving data.',
  UNIQUE_DATA_CONFLICT: 'Duplicating object exists.',
  DATA_NOT_FOUND: 'Cannot find data.',
  PARTIAL_SUCCESS:
    'Part of your request was successfully processed, but some were not.',
  DATABASE_PROCESS_FAIL: 'Failed to process the operation on database.',
  FILE_PROCESS_FAIL: 'Failed while processing file.',
};

export default (code: string): string => {
  const returnData = translateDict[code];
  if (!returnData) {
    return 'Unknown error occured.';
  }
  return returnData;
};
