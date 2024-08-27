import sys

import service_gen
import model_gen


if __name__ == "__main__":
  if len(sys.argv) != 4:
    print("Usage: python generate_notif.py <notif_type_name> <component_file> <service_file>")
    exit(1)

  notif_type_name = sys.argv[1]
  model_js_file_path = sys.argv[2]
  service_js_file_path = sys.argv[3]

  try:
    model_gen.generate_model_file(notif_type_name, model_js_file_path)

  except Exception as e:
    print(f"Error generating model JS file: {e}")
    exit(1)

  try:
    service_gen.generate_service_file(notif_type_name, service_js_file_path)
  except Exception as e:
    print(f"Error generating service file: {e}")
    exit(1)
