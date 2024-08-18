import type { ILogger } from "../logger";
import { IUserNotificationMetadataRepository } from "../repositories/IUserNotificationMetadataRepository";

export class UserNotificationMetadataService {
  constructor(
    private readonly viewerUserId: string,
    private readonly repository: IUserNotificationMetadataRepository,
    private readonly logger: ILogger
  ) {}

  genIfUserHasNewNotificationX = async (): Promise<boolean> => {
    try {
      const [userMetadata, latestNotifCreateTime] = await Promise.all([
        this.repository.genFetchUserMetadataX(),
        this.repository.genFetchLatestCreationTimeForUserX(),
      ]);
      const lastFetchTime = userMetadata?.lastFetchTime ?? 0;
      return latestNotifCreateTime > lastFetchTime;
    } catch (e) {
      this.logger.error(
        `Error fetching user metadata for ${this.viewerUserId}`
      );
      throw e;
    }
  };

  genUpdateWatermarkForUserX = async (): Promise<void> => {
    try {
      await this.repository.genUpdateWatermarkForUserX();
    } catch (e) {
      this.logger.error(`Error updating watermark for ${this.viewerUserId}`);
      throw e;
    }
  };
}
