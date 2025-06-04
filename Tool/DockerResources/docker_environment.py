# Licensed under the MIT License.
# For details on the licensing terms, see the LICENSE file.
# SPDX-License-Identifier: MIT

# Copyright 2024-2025 (c) Fraunhofer IOSB (Author: Johannes Engel)


import threading
from python_on_whales import DockerClient

class DockerComposeEnvironment:
    def __init__(self, services):
        self.services = services
        self.default_docker_compose_files = ["./docker-compose.yaml"]
        # Line 13 important because stop independent from start
        self.docker = DockerClient(compose_files=self.default_docker_compose_files)

    def start_docker_compose(self, compose_files=None):
        compose_files = self.default_docker_compose_files if compose_files is None else compose_files
        self.docker.compose.up(services=self.services, pull="missing")

    def run_docker_compose(self, compose_files=None):
        thread = threading.Thread(target=self.start_docker_compose, args=(compose_files,))
        thread.start()

    def stop_docker_compose(self):
        self.docker.compose.down()
