class ConflictError extends Error {
  statusCode: number;

  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

export default module.exports = ConflictError;
