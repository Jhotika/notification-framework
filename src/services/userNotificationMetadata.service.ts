import { DatabaseType } from "../configs/database.config";
import { Logger } from "../logger";
import { IUserNotificationMetadataRepository } from "../repositories/IUserNotificationMetadataRepository";
import { RepositoryFactory } from "../repositories/repositoryFactory";

export class UserNotificationMetadataService {
  private readonly repository: IUserNotificationMetadataRepository;

  constructor(private readonly viewerUserId: string) {
    const repository = RepositoryFactory.getRepositoryX(
      viewerUserId,
      DatabaseType.MongoDB
    );
    this.repository = repository.userNotificationMetadataRepository;
  }

  genIfUserHasNewNotificationX = async (): Promise<boolean> => {
    try {
      const [userMetadata, latestNotifCreateTime] = await Promise.all([
        this.repository.genFetchUserMetadataX(),
        this.repository.genFetchLatestCreationTimeForUserX(),
      ]);
      const lastFetchTime = userMetadata?.lastFetchTime ?? 0;
      return latestNotifCreateTime > lastFetchTime;
    } catch (e) {
      Logger.error(`Error fetching user metadata for ${this.viewerUserId}`);
      throw e;
    }
  };

  genUpdateWatermarkForUserX = async (): Promise<void> => {
    try {
      await this.repository.genUpdateWatermarkForUserX();
    } catch (e) {
      Logger.error(`Error updating watermark for ${this.viewerUserId}`);
      throw e;
    }
  };
}
