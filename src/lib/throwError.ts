const optionsDefault = {
  logError: false,
  data: {}
};

function throwError(message: string, status: number, options = optionsDefault) {
  const error: any = new Error(message);
  error.expose = true;
  if (status) error.status = status;
  error.data = options.data || {};
  if (options.logError) {
    console.error(error.stack);
  }

  throw error;
}

export default throwError;
