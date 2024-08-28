
def generate_model_file(param, output_file):
  """
  Generates a TS file with a class declaration based on the given parameter.

  Args:
    param: The name of the class.
    output_file: The path to the output JS file.
  """
  notif_name = param+"Notification"

  try:
    template = f"""
import {{ v4 }} from "uuid";
import {{
  AbstractNotification,
  INotification,
}} from "../../lib/models/abstractNotification";

import {{ INotificationResponse }} from "../../lib/models/abstractNotification";

interface I{notif_name} extends INotification {{
  // Add more fields here
}}

interface I{notif_name}Response extends INotificationResponse {{
  notification: I{notif_name};
  // Add more fields here
}}

export class {notif_name} extends AbstractNotification implements I{notif_name} {{
  static notifType = "{param}";
  constructor(
    uid: string = v4(),
    ownerUid: string,
    senderUid: string,
    isRead: boolean = false,
    createdAt: number = Date.now(),
    payload: Record<string, any> = {{}},
  ) {{
    super(uid, {notif_name}.notifType, payload, ownerUid, senderUid, isRead, createdAt);
  }}

  static new(
    ownerUid: string,
    senderUid: string,
    payload: Record<string, any>,
  ): {notif_name} {{
    return new {notif_name}( v4(), ownerUid, senderUid, false, Date.now(), payload );
  }}

  genResponse = async (): Promise<I{notif_name}Response> => {{
    return {{
      notification: {{
        uid: this.uid,
        type: this.type,
        payload: this.payload,
        ownerUid: this.ownerUid,
        isRead: this.isRead,
        createdAt: this.createdAt,
      }} as INotification,
    }};
  }};
}}

"""
    with open(output_file, 'w') as output:
      output.write(template)

    print(f"Model file generated successfully: {output_file}")
  except Exception as e:
    print(f"Error generating JS file: {e}")
