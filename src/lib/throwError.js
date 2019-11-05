const optionsDefault = {
  logError: false,
  data: {}
};

function throwError(message, status, options = optionsDefault) {
  const error = new Error(message);
  error.expose = true;
  if (status) error.status = status;
  error.data = options.data || {};
  if (options.logError) {
    console.error(error.stack);
  }

  throw error;
}

module.exports = throwError;
