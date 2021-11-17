class ServerError extends Error {
  constructor (...args) {
    super(...args);
    Error.captureStackTrace(this, ServerError);
    this.status = args[0].status;
    this.error = args[0].error;
  }
}

module.exports = ServerError;