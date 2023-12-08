class NotFoundError extends Error {
  statusCode: number;

  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

export default module.exports = NotFoundError;
