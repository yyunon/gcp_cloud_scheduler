from __future__ import annotations
from google.cloud import logging as g_logging

import sys
import os
import logging
from typing import Any

from google.api_core.extended_operation import ExtendedOperation
from google.cloud import compute_v1

PROJECT_ID = os.environ["PROJECT_ID"]
ZONE = os.environ["ZONE"]
MACHINE_NAME = os.environ["MACHINE_NAME"]

def wait_for_extended_operation(
    operation: ExtendedOperation, verbose_name: str = "operation", timeout: int = 300
) -> Any:
	result = operation.result(timeout=timeout)

	if operation.error_code:
			print(
					f"Error during {verbose_name}: [Code: {operation.error_code}]: {operation.error_message}",
					file=sys.stderr,
					flush=True,
			)
			print(f"Operation ID: {operation.name}", file=sys.stderr, flush=True)
			raise operation.exception() or RuntimeError(operation.error_message)

	if operation.warnings:
			print(f"Warnings during {verbose_name}:\n", file=sys.stderr, flush=True)
			for warning in operation.warnings:
					print(f" - {warning.code}: {warning.message}", file=sys.stderr, flush=True)

	return result


def delete_instance(project_id: str, zone: str, machine_name: str) -> None:
	instance_client = compute_v1.InstancesClient()

	print(f"Deleting {machine_name} from {zone}...")
	operation = instance_client.delete(
			project=project_id, zone=zone, instance=machine_name
	)
	wait_for_extended_operation(operation, "instance deletion")
	print(f"Instance {machine_name} deleted.")

def main():
	logging.info(f"Operating in {PROJECT_ID}, {ZONE}, {MACHINE_NAME}")
	print(f"Operating in {PROJECT_ID}, {ZONE}, {MACHINE_NAME}")

if __name__ == "__main__":
	client = g_logging.Client()
	client.setup_logging()
	main()
	delete_instance(PROJECT_ID, ZONE, MACHINE_NAME)