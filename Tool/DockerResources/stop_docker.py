# Licensed under the MIT License.
# For details on the licensing terms, see the LICENSE file.
# SPDX-License-Identifier: MIT

# Copyright 2024-2025 (c) Fraunhofer IOSB (Author: Johannes Engel)


from docker_environment import DockerComposeEnvironment

if __name__ == "__main__":
    services = ["Device_Registry", "Service_Server", "Dashboard", "ClientInterface"]
    env = DockerComposeEnvironment(services)
    env.stop_docker_compose()