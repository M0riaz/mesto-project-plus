class BadRequestError extends Error {
  statusCode: number;

  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

export default module.exports = BadRequestError;
