
def generate_model_file(param, output_file):
  """
  Generates a TS file with a class declaration based on the given parameter.

  Args:
    param: The name of the class.
    output_file: The path to the output JS file.
  """
  notif_name = param+"Notification"

  try:
    template = template = f"""

import {{AbstractNotification, NotificationTypes}} from "./abstractNotification";
import {{ v4 as uuidv4 }} from "uuid";
import {{ User }} from "../../users/components/User";
import {{ AbstractNotificationResponse }} from "./abstractNotificationResponse";
import {{ logger }} from "../../../logger";

export class {notif_name} extends AbstractNotification {{
  static notifType = NotificationTypes.{param};
  constructor(
    public readonly uuid: string,
    public readonly payload: Record<string, any>,
    public readonly ownerUuid: string,
    public readonly senderUuid: string,
    public isRead: boolean,
    public readonly createdAt: number,
  ) {{
    super(
      uuid,
      {notif_name}.notifType,
      payload,
      ownerUuid,
      isRead,
      createdAt
    );
  }}

  static New = (
    payload: Object,
    ownerUuid: string,
    senderUuid: string,
  ): {notif_name} => {{
    return new {notif_name}(
      uuidv4(),
      payload,
      ownerUuid,
      senderUuid,
      false, // isRead
      Date.now(),
    );
  }};

  static fromRaw = (raw: Object): {notif_name} => {{
    return new {notif_name}(
      raw["uuid"],
      raw["payload"],
      raw["ownerUuid"],
      raw["senderUuid"],
      raw["isRead"] || false,
      raw["createdAt"] || 0,
    );
  }};

  genResponse =
    async (): Promise<{notif_name}ResponseType | null> => {{
      return new {notif_name}Response(this).genResponse();
    }};
}}

export type {notif_name}ResponseType = {{
  notification: {notif_name};
  senderName: string;
}};

export class {notif_name}Response extends AbstractNotificationResponse {{
  constructor(public notification: {notif_name}) {{
    super(notification);
  }}

  genResponse =
    async (): Promise<{notif_name}ResponseType | null> => {{
      throw new Error("Method not implemented.");
    }};
}}
"""
    with open(output_file, 'w') as output:
      output.write(template)

    print(f"Model file generated successfully: {output_file}")
  except Exception as e:
    print(f"Error generating JS file: {e}")
