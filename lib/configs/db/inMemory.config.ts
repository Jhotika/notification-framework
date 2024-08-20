import { AbstractDbConfig } from "./abstractDb.config";

export interface IInMemoryConfig {
  // No configuration required
}

export const dbType = "in-memory";

export class InMemoryConfig extends AbstractDbConfig {
  constructor(public readonly dbType: string) {
    super();
  }

  static verifyConfigX = (_config: IInMemoryConfig): void => {
    if (
      process.env.NODE_ENV === "production" &&
      process.env.IN_MEMORY_IN_PROD !== "true"
    ) {
      throw new Error(
        "In-memory database is only supported in test environments"
      );
    }
  };
}
