class InternalServerError extends Error {
  statusCode: number;

  constructor(message) {
    super(message);
    this.statusCode = 500;
  }
}

export default module.exports = InternalServerError;
