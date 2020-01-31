const optionsDefault = {
  log: false,
  data: {}
};

function throwError(
  message: string,
  status: number,
  errorCode: string,
  options = optionsDefault
) {
  const error: any = new Error(message);
  error.expose = true;

  error.status = status;
  error.errorCode = errorCode;

  error.data = options.data || {};

  if (options.log) {
    console.error(error.stack);
  }

  throw error;
}

export default throwError;
