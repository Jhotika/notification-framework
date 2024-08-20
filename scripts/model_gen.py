
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
import {{
  AbstractNotification,
  INotification,
}} from "../../lib/models/abstractNotification";

interface I{notif_name} {{
  notification: INotification;
  // Add more fields here
}}

export class {notif_name} extends AbstractNotification {{
  constructor(
    uuid: string,
    type: string,
    payload: Record<string, any>,
    ownerUuid: string,
    senderUuid: string,
    isRead: boolean,
    createdAt: number,
    public readonly customField: string
  ) {{
    super(uuid, type, payload, ownerUuid, senderUuid, isRead, createdAt);
  }}

  genResponse = async (): Promise<I{notif_name}> => {{
    return {{
      notification: {{
        uuid: this.uuid,
        type: this.type,
        payload: this.payload,
        ownerUuid: this.ownerUuid,
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
