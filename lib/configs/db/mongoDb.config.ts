export interface IMongoDbConfig {
  user: string;
  password: string;
  clusterUri: string;
  db: string;
}

export const dbType = "mongodb";

export class MongoDbConfig extends AbstractDbConfig {
  constructor(
    public readonly dbType: string,
  ) {
    super();
  }

  static verifyConfigX = (config: IMongoDbConfig): void => {
    const missingFields: string[] = [];
    if (!config.user) {
      missingFields.push("MongoDB user");
    }
    if (!config.password) {
      missingFields.push("MongoDB password");
    }
    if (!config.clusterUri) {
      missingFields.push("MongoDB cluster URI");
    }
    if (!config.db) {
      missingFields.push("MongoDB database name");
    }
    if (missingFields.length > 0) {
      throw new Error(
        `${missingFields.join(", ")} ${
          missingFields.length > 1 ? "is" : "are"
        } required`
      );
    }
  };
}
