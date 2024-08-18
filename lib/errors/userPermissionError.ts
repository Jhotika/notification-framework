export class UserPermissionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserPermissionError";
  }
}
