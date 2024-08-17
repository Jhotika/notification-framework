export class DatabaseNotSupportedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DatabaseNotSupportedError";
  }
}
