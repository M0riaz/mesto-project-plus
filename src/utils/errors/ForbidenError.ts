class ForbiddenError extends Error {
  statusCode: number;

  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

export default module.exports = ForbiddenError;
