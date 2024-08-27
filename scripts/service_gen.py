def create_notification_method(param):
  notification_class = param+"Notification"
  return f"""
  static async genCreate{notification_class} (
      payload: Record<string, any>,
      ownerUuid: string,
      senderUuid: string,
  ): Promise<void> {{
    try {{
      const notification = {notification_class}.New(
          payload,
          ownerUuid,
          senderUuid,
      )
      await NotificationService.genSave(notification)
    }} catch (e) {{
      new Logger().error(
          "Failed to create {param} notification for user {{ownerUuid}}: " + e.message?.toString()
      )
    }}
  }}
  """

def remove_notification_method():
  return f"""
  static async genRemoveNotification (
  ): Promise<boolean> {{
    throw new Error("Method not implemented.")
  }}
  """

# Print the generated class definition
def generate_service_file(param, file_path):
  create_method = create_notification_method(param)
  remove_method = remove_notification_method(
  )
  class_name = f"{param}NotificationService"
  with open(file_path, "w") as file:
    file.write(f"""
import {{ Logger }} from "../logger";
import {{ {param}Notification }} from "../models/{param}Notification";
import {{ NotificationService }} from "./notificationService";

export class {class_name} {{
  {create_method}
  {remove_method}
}}
    """)
  print(f"Service file generated successfully: {file_path}")