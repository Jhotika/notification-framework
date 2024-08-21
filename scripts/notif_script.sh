#!/bin/bash

python_script="generate_notif.py"  # Replace with the actual path to your Python script
output_path="../src/models/"
service_output_path="../src/services/"

if [ $# -ne 1 ]; then
  echo "Usage: $0 <class_name>"
  exit 1
fi

class_name="$1"
output_file_name="$output_path${class_name}Notification.ts"
service_output_file_name="$service_output_path${class_name}Notification.service.ts"
python3 "$python_script" "$class_name" "$output_file_name" "$service_output_file_name"

