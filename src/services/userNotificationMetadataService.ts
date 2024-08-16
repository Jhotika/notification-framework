import { Logger } from "../logger";
import { IUserNotificationMetadataRepository } from "../repositories/IUserNotificationMetadataRepository";

export class UserNotificationMetadataService {
  constructor(
    private viewerUserId: string,
    private repository: IUserNotificationMetadataRepository
  ) {}

  genIfUserHasNewNotificationX = async (): Promise<boolean> => {
    try {
      const userMetadata = await this.repository.genFetchUserMetadataX(
        this.viewerUserId
      );
      const latestNotifCreateTime = userMetadata?.latestNotifCreateTime ?? 0;
      const lastFetchTime = userMetadata?.lastFetchTime ?? 0;
      return latestNotifCreateTime > lastFetchTime;
    } catch (e) {
      Logger.error(`Error fetching user metadata for ${this.viewerUserId}`);
      throw e;
    }
  };

  genUpdateWatermarkForUserX = async (): Promise<void> => {
    try {
      await this.repository.genUpdateWatermarkForUserX(this.viewerUserId);
    } catch (e) {
      Logger.error(`Error updating watermark for ${this.viewerUserId}`);
      throw e;
    }
  };
}
