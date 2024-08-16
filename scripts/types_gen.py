import re

def update_notif_types(param):
  """
  Adds a new member to an existing enum in a JS file.

  Args:
    param: The new enum member name.
    enum_name: The name of the enum.
    js_file: The path to the JS file.
  """
  js_file = "../src/models/abstractNotification.ts"
  enum_name = "NotificationTypes"

  try:
    with open(js_file, 'r') as f:
      content = f.read()

    # Improved regular expression pattern (may need further refinement)
    enum_pattern = rf"(?:export\s+)?const\s+{enum_name}\s+=\s+{{(.*?)}}"

    match = re.search(enum_pattern, content, re.DOTALL)  # Allow matching across newlines

    if not match:
      raise ValueError(f"Enum '{enum_name}' not found in {js_file}")

    enum_body = match.group(1)
    keys = re.findall(r'(\w+):', enum_body)
    if param in keys:
      print(f"Enum member '{param}' already exists in '{enum_name}'")
      return

    # Append the new member before the closing brace
    new_member = f"  {param}: \"{param}\","
    new_enum_body = f"{enum_body}{new_member}\n"

    # Replace the old enum with the new one
    new_content = re.sub(enum_pattern, rf"export const {enum_name} = {{{new_enum_body}}}", content, flags=re.DOTALL)

    with open(js_file, 'w') as f:
      f.write(new_content)

    print(f"Added '{param}' to enum '{enum_name}' in {js_file}")
    return True

  except Exception as e:
    print(f"Error adding type member: {e}")