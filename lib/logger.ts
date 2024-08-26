export interface ILogger {
  log(message: any, ...optionalParams: any[]): void;
  info(message: any, ...optionalParams: any[]): void;
  warn(message: any, ...optionalParams: any[]): void;
  error(message: any, ...optionalParams: any[]): void;
}

export class Logger implements ILogger {
  constructor() {}
  warn(message: any, ...optionalParams: any[]): void {
    console.warn(message, optionalParams);
  }
  error(message: any, ...optionalParams: any[]): void {
    console.error(message, optionalParams);
  }
  log = (message: string, ...optionalParams: any[]) => {
    console.log(message, optionalParams);
  };
  info = (message: string, ...optionalParams: any[]) => {
    console.info(message, optionalParams);
  };
}
